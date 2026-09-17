import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  EXPIRY_WARN_DAYS,
  ZONES,
  seedBuses,
  seedMaintenance,
  seedRoutes,
  seedStudents,
  staff,
} from "@/assets/data/busSeed";
import { useToast } from "@/components/ui";
import { parseDate, toIsoDate } from "@/utils/format";

const BusContext = createContext(null);

const SAVE_DELAY = 700;
const MS_DAY = 86400000;

const toMinutes = (time) => {
  const [h, m] = String(time).split(":").map(Number);
  return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : NaN;
};

const minutesToLabel = (total) => {
  if (!Number.isFinite(total)) return "—";
  const h = Math.floor(total / 60);
  const m = total % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

/* One definition of "how close is this to expiring", used by insurance,
   inspection and driving licences alike. */
const expiryState = (date) => {
  if (!date) return { days: null, state: "none" };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.round((parseDate(date).getTime() - today.getTime()) / MS_DAY);
  return {
    days,
    state:
      days < 0 ? "expired"
      : days <= EXPIRY_WARN_DAYS ? "soon"
      : "ok",
  };
};

const zoneById = Object.fromEntries(ZONES.map((z) => [z.id, z]));
const staffById = Object.fromEntries(staff.map((s) => [s.id, s]));

export function BusProvider({ children }) {
  const { toast } = useToast();

  const [routes, setRoutes] = useState(seedRoutes);
  const [buses, setBuses] = useState(seedBuses);
  const [students, setStudents] = useState(seedStudents);
  const [maintenance, setMaintenance] = useState(seedMaintenance);

  const [activeTab, setActiveTab] = useState("routes");
  const [routeId, setRouteId] = useState(seedRoutes[0].id);
  const [busId, setBusId] = useState(seedBuses[0].id);
  const [draggingStopId, setDraggingStopId] = useState(null);

  const [stopModal, setStopModal] = useState(null);
  const [assignStop, setAssignStop] = useState(null);
  const [crewModal, setCrewModal] = useState(null);
  const [incidentOpen, setIncidentOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const stopFormRef = useRef(null);
  const crewFormRef = useRef(null);
  const incidentFormRef = useRef(null);

  /* ---------------- Derived fleet ---------------- */
  const fleet = useMemo(
    () =>
      buses.map((bus) => {
        const insurance = expiryState(bus.insuranceExpiry);
        const inspection = expiryState(bus.inspectionExpiry);
        const driver = bus.driverId ? staffById[bus.driverId] : null;
        const attendant = bus.attendantId ? staffById[bus.attendantId] : null;
        const licence = driver ? expiryState(driver.licenseExpiry) : null;

        const worst = [insurance.state, inspection.state, licence?.state].includes(
          "expired",
        )
          ? "expired"
          : [insurance.state, inspection.state, licence?.state].includes("soon") ?
            "soon"
          : "ok";

        return {
          ...bus,
          insurance,
          inspection,
          driver,
          attendant,
          licence,
          worst,
          unassigned: !driver || !attendant,
        };
      }),
    [buses],
  );

  const busById = useMemo(
    () => Object.fromEntries(fleet.map((b) => [b.id, b])),
    [fleet],
  );

  /* ---------------- Derived routes ---------------- */
  const ridersByStop = useMemo(() => {
    const map = {};
    students.forEach((s) => {
      (map[s.stopId] ??= []).push(s);
    });
    return map;
  }, [students]);

  const ridersByRoute = useMemo(() => {
    const map = {};
    students.forEach((s) => {
      (map[s.routeId] ??= []).push(s);
    });
    return map;
  }, [students]);

  const routeRows = useMemo(
    () =>
      routes.map((route) => {
        const bus = busById[route.busId] ?? null;
        const riders = ridersByRoute[route.id] ?? [];
        const capacity = bus?.capacity ?? 0;
        const zone = zoneById[route.zone];

        const times = route.stops.map((s) => toMinutes(s.time));
        const first = Math.min(...times);
        const last = Math.max(...times);
        const duration =
          route.stops.length > 1 && Number.isFinite(first) && Number.isFinite(last)
            ? last - first
            : 0;

        const paid = riders.filter((r) => r.feePaid).length;

        return {
          ...route,
          bus,
          zone,
          riders,
          assigned: riders.length,
          capacity,
          /* Over capacity is the headline state — it means a child has no seat. */
          fill: capacity > 0 ? riders.length / capacity : 0,
          seatsLeft: capacity - riders.length,
          overCapacity: capacity > 0 && riders.length > capacity,
          duration,
          durationLabel: minutesToLabel(duration),
          stops: route.stops.map((s) => ({
            ...s,
            boarding: (ridersByStop[s.id] ?? []).length,
          })),
          feePaidCount: paid,
          feeDueCount: riders.length - paid,
          feeExpected: riders.length * (zone?.fee ?? 0),
          feeCollected: paid * (zone?.fee ?? 0),
        };
      }),
    [routes, busById, ridersByRoute, ridersByStop],
  );

  const route = useMemo(
    () => routeRows.find((r) => r.id === routeId) ?? routeRows[0],
    [routeRows, routeId],
  );

  const bus = useMemo(
    () => fleet.find((b) => b.id === busId) ?? fleet[0],
    [fleet, busId],
  );

  /* Worst first — an over-capacity route is the one to act on. */
  const occupancy = useMemo(
    () =>
      [...routeRows].sort((a, b) => {
        if (a.overCapacity !== b.overCapacity) return a.overCapacity ? -1 : 1;
        return b.fill - a.fill;
      }),
    [routeRows],
  );

  /* ---------------- Stops ---------------- */
  const saveStop = useCallback(
    (stop) => {
      setRoutes((prev) =>
        prev.map((r) => {
          if (r.id !== routeId) return r;
          const exists = r.stops.some((s) => s.id === stop.id);
          const stops =
            exists ?
              r.stops.map((s) => (s.id === stop.id ? stop : s))
            : [...r.stops, stop];
          return { ...r, stops: [...stops].sort((a, b) => toMinutes(a.time) - toMinutes(b.time)) };
        }),
      );
      setStopModal(null);
      toast.success(`${stop.name} saved to the route`);
    },
    [routeId, toast],
  );

  const removeStop = useCallback(
    (stopId) => {
      const boarding = (ridersByStop[stopId] ?? []).length;
      if (boarding > 0) {
        toast.error(
          `${boarding} student(s) board here — move them before removing the stop.`,
        );
        return;
      }
      setRoutes((prev) =>
        prev.map((r) =>
          r.id === routeId ?
            { ...r, stops: r.stops.filter((s) => s.id !== stopId) }
          : r,
        ),
      );
      toast.info("Stop removed");
    },
    [routeId, ridersByStop, toast],
  );

  /* Dragging reorders the sequence; the times ride along with the stop, so
     the duration recalculates from whatever order is left. */
  const reorderStops = useCallback(
    (fromId, toId) => {
      if (!fromId || fromId === toId) return;
      setRoutes((prev) =>
        prev.map((r) => {
          if (r.id !== routeId) return r;
          const stops = [...r.stops];
          const from = stops.findIndex((s) => s.id === fromId);
          const to = stops.findIndex((s) => s.id === toId);
          if (from === -1 || to === -1) return r;
          const [moved] = stops.splice(from, 1);
          stops.splice(to, 0, moved);
          return { ...r, stops };
        }),
      );
      setDraggingStopId(null);
    },
    [routeId],
  );

  /* ---------------- Student assignment ---------------- */
  const assignCheck = useCallback(
    (targetRoute) => {
      if (!targetRoute?.bus)
        return { ok: false, reason: "This route has no bus assigned yet." };
      if (targetRoute.assigned >= targetRoute.capacity)
        return {
          ok: false,
          reason: `${targetRoute.bus.number} is full at ${targetRoute.capacity} seats — free a seat first.`,
        };
      return { ok: true, reason: "" };
    },
    [],
  );

  const assignStudent = useCallback(
    (studentId, stopId) => {
      const target = routeRows.find((r) => r.stops.some((s) => s.id === stopId));
      const check = assignCheck(target);
      if (!check.ok) {
        toast.error(check.reason);
        return false;
      }
      setStudents((prev) =>
        prev.map((s) =>
          s.id === studentId ? { ...s, routeId: target.id, stopId } : s,
        ),
      );
      toast.success("Student moved to that stop");
      return true;
    },
    [routeRows, assignCheck, toast],
  );

  const moveStudentStop = useCallback(
    (studentId, stopId) => {
      setStudents((prev) =>
        prev.map((s) => (s.id === studentId ? { ...s, stopId } : s)),
      );
    },
    [],
  );

  const removeRider = useCallback(
    (studentId) => {
      setStudents((prev) => prev.filter((s) => s.id !== studentId));
      toast.info("Student taken off the route");
    },
    [toast],
  );

  /* ---------------- Fees ---------------- */
  const toggleFee = useCallback((studentId) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, feePaid: !s.feePaid } : s)),
    );
  }, []);

  const feeTotals = useMemo(() => {
    const expected = routeRows.reduce((sum, r) => sum + r.feeExpected, 0);
    const collected = routeRows.reduce((sum, r) => sum + r.feeCollected, 0);
    return { expected, collected, due: expected - collected };
  }, [routeRows]);

  /* ---------------- Crew ---------------- */
  const assignCrew = useCallback(
    (targetBusId, { driverId, attendantId }) => {
      setSaving(true);
      setTimeout(() => {
        setBuses((prev) =>
          prev.map((b) =>
            b.id === targetBusId ?
              { ...b, driverId: driverId || null, attendantId: attendantId || null }
            : b,
          ),
        );
        setSaving(false);
        setCrewModal(null);
        toast.success("Crew updated");
      }, SAVE_DELAY);
    },
    [toast],
  );

  const drivers = useMemo(() => staff.filter((s) => s.role === "driver"), []);
  const attendants = useMemo(
    () => staff.filter((s) => s.role === "attendant"),
    [],
  );

  /* ---------------- Maintenance ---------------- */
  const busMaintenance = useMemo(() => {
    const record = maintenance[bus?.id] ?? {
      services: [],
      incidents: [],
      nextServiceDue: null,
    };
    return { ...record, due: expiryState(record.nextServiceDue) };
  }, [maintenance, bus]);

  const logIncident = useCallback(
    (targetBusId, incident) => {
      setMaintenance((prev) => ({
        ...prev,
        [targetBusId]: {
          ...prev[targetBusId],
          incidents: [
            { ...incident, id: `IN-${Date.now().toString().slice(-5)}` },
            ...(prev[targetBusId]?.incidents ?? []),
          ],
        },
      }));
      setIncidentOpen(false);
      toast.success("Incident logged against the vehicle");
    },
    [toast],
  );

  /* ---------------- Summary ---------------- */
  const summary = useMemo(
    () => ({
      routes: routeRows.length,
      riders: students.length,
      alerts:
        fleet.filter((b) => b.worst !== "ok").length +
        fleet.filter((b) => b.unassigned).length,
      feesDue: feeTotals.due,
    }),
    [routeRows, students, fleet, feeTotals],
  );

  const value = useMemo(
    () => ({
      /* reference */
      zones: ZONES,
      staff,
      drivers,
      attendants,
      warnDays: EXPIRY_WARN_DAYS,
      today: toIsoDate(new Date()),

      /* routes */
      routeRows,
      route,
      routeId,
      setRouteId,
      saveStop,
      removeStop,
      reorderStops,
      draggingStopId,
      setDraggingStopId,
      stopModal,
      setStopModal,
      stopFormRef,

      /* riders */
      students,
      ridersByStop,
      assignStop,
      setAssignStop,
      assignStudent,
      moveStudentStop,
      removeRider,
      assignCheck,

      /* fleet */
      fleet,
      bus,
      busId,
      setBusId,
      crewModal,
      setCrewModal,
      crewFormRef,
      assignCrew,
      saving,

      /* occupancy */
      occupancy,

      /* fees */
      toggleFee,
      feeTotals,

      /* maintenance */
      busMaintenance,
      incidentOpen,
      setIncidentOpen,
      incidentFormRef,
      logIncident,

      /* shell */
      activeTab,
      setActiveTab,
      summary,
    }),
    [
      drivers,
      attendants,
      routeRows,
      route,
      routeId,
      saveStop,
      removeStop,
      reorderStops,
      draggingStopId,
      stopModal,
      students,
      ridersByStop,
      assignStop,
      assignStudent,
      moveStudentStop,
      removeRider,
      assignCheck,
      fleet,
      bus,
      busId,
      crewModal,
      assignCrew,
      saving,
      occupancy,
      toggleFee,
      feeTotals,
      busMaintenance,
      incidentOpen,
      logIncident,
      activeTab,
      summary,
    ],
  );

  return <BusContext.Provider value={value}>{children}</BusContext.Provider>;
}

export function useBus() {
  const ctx = useContext(BusContext);
  if (!ctx) throw new Error("useBus must be used inside <BusProvider>");
  return ctx;
}
