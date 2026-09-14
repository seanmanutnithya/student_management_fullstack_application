import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  SHIFTS,
  blocks,
  rooms,
  seedGateLog,
  seedLeave,
  seedResidents,
  seedTickets,
  wardens,
} from "@/assets/data/hostelSeed";
import { useToast } from "@/components/ui";
import { parseDate, toIsoDate } from "@/utils/format";

const HostelContext = createContext(null);

const SAVE_DELAY = 700;
const MS_DAY = 86400000;

const blockById = Object.fromEntries(blocks.map((b) => [b.id, b]));
const roomById = Object.fromEntries(rooms.map((r) => [r.id, r]));

const daysSince = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((today.getTime() - parseDate(date).getTime()) / MS_DAY);
};

export function HostelProvider({ children }) {
  const { toast } = useToast();

  const [residents, setResidents] = useState(seedResidents);
  const [gateLog, setGateLog] = useState(seedGateLog);
  const [leave, setLeave] = useState(seedLeave);
  const [tickets, setTickets] = useState(seedTickets);

  const [activeTab, setActiveTab] = useState("rooms");
  const [blockId, setBlockId] = useState(blocks[0].id);
  const [floor, setFloor] = useState(blocks[0].floors[0]);
  const [roomId, setRoomId] = useState(null);

  const [query, setQuery] = useState("");
  const [blockFilter, setBlockFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [ticketStatus, setTicketStatus] = useState("");

  const [allocateFor, setAllocateFor] = useState(null);
  const [ticketOpen, setTicketOpen] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const allocateFormRef = useRef(null);
  const ticketFormRef = useRef(null);
  const gateFormRef = useRef(null);

  /* ---------------- Occupancy, derived ---------------- */
  const residentsByRoom = useMemo(() => {
    const map = {};
    residents.forEach((r) => {
      if (r.roomId) (map[r.roomId] ??= []).push(r);
    });
    return map;
  }, [residents]);

  const roomRows = useMemo(
    () =>
      rooms.map((room) => {
        const occupants = residentsByRoom[room.id] ?? [];
        const free = room.beds - occupants.length;
        return {
          ...room,
          block: blockById[room.blockId],
          occupants,
          occupied: occupants.length,
          free,
          state:
            occupants.length === 0 ? "empty"
            : free <= 0 ? "full"
            : "partial",
        };
      }),
    [residentsByRoom],
  );

  const roomRowById = useMemo(
    () => Object.fromEntries(roomRows.map((r) => [r.id, r])),
    [roomRows],
  );

  const blockStats = useMemo(
    () =>
      blocks.map((block) => {
        const blockRooms = roomRows.filter((r) => r.blockId === block.id);
        const beds = blockRooms.reduce((sum, r) => sum + r.beds, 0);
        const occupied = blockRooms.reduce((sum, r) => sum + r.occupied, 0);
        return {
          ...block,
          rooms: blockRooms,
          beds,
          occupied,
          vacant: beds - occupied,
          percent: beds ? Math.round((occupied / beds) * 1000) / 10 : 0,
        };
      }),
    [roomRows],
  );

  const totals = useMemo(() => {
    const beds = blockStats.reduce((sum, b) => sum + b.beds, 0);
    const occupied = blockStats.reduce((sum, b) => sum + b.occupied, 0);
    return {
      beds,
      occupied,
      vacant: beds - occupied,
      percent: beds ? Math.round((occupied / beds) * 1000) / 10 : 0,
    };
  }, [blockStats]);

  const roomsWithSpace = useMemo(
    () => roomRows.filter((r) => r.free > 0).sort((a, b) => b.free - a.free),
    [roomRows],
  );

  /* ---------------- Navigator ---------------- */
  const block = blockById[blockId];
  const floorRooms = useMemo(
    () => roomRows.filter((r) => r.blockId === blockId && r.floor === floor),
    [roomRows, blockId, floor],
  );
  const room = roomId ? roomRowById[roomId] : null;

  const selectBlock = useCallback((id) => {
    setBlockId(id);
    setFloor(blockById[id].floors[0]);
    setRoomId(null);
  }, []);

  /* ---------------- Allocation rules ---------------- */
  /* Every refusal names the rule it broke — a blocked action with no reason
     is just a dead button. */
  const canAllocate = useCallback(
    (resident, targetRoom) => {
      if (!resident) return { ok: false, reason: "Pick a resident first." };
      if (!targetRoom) return { ok: false, reason: "Pick a room first." };

      const rules = blockById[targetRoom.blockId];

      if (resident.roomId === targetRoom.id)
        return { ok: false, reason: `${resident.name} is already in this room.` };

      if (targetRoom.free <= 0)
        return {
          ok: false,
          reason: `Room ${targetRoom.number} is full — all ${targetRoom.beds} beds are taken.`,
        };

      if (rules.gender !== "any" && resident.gender !== rules.gender)
        return {
          ok: false,
          reason: `${rules.name} takes ${rules.gender} residents only.`,
        };

      if (resident.grade < rules.minGrade)
        return {
          ok: false,
          reason: `${rules.name} is Grade ${rules.minGrade} and above — ${resident.name} is in Grade ${resident.grade}.`,
        };

      return { ok: true, reason: "" };
    },
    [],
  );

  const allocate = useCallback(
    (residentId, targetRoomId) => {
      const resident = residents.find((r) => r.id === residentId);
      const targetRoom = roomRowById[targetRoomId];
      const check = canAllocate(resident, targetRoom);
      if (!check.ok) {
        toast.error(check.reason);
        return false;
      }

      setSaving(true);
      setTimeout(() => {
        setResidents((prev) =>
          prev.map((r) =>
            r.id === residentId ? { ...r, roomId: targetRoomId } : r,
          ),
        );
        setSaving(false);
        setAllocateFor(null);
        toast.success(
          `${resident.name} moved into room ${targetRoom.number}`,
        );
      }, SAVE_DELAY);
      return true;
    },
    [residents, roomRowById, canAllocate, toast],
  );

  const unassign = useCallback(
    (residentId) => {
      setResidents((prev) =>
        prev.map((r) => (r.id === residentId ? { ...r, roomId: null } : r)),
      );
      toast.info("Resident checked out of the room");
    },
    [toast],
  );

  const unassigned = useMemo(
    () => residents.filter((r) => !r.roomId),
    [residents],
  );

  /* ---------------- Gate ---------------- */
  /* The newest entry per resident decides in/out — no separate flag to
     fall out of step with the log. */
  const gateState = useMemo(() => {
    const latest = {};
    [...gateLog]
      .sort((a, b) => new Date(a.at) - new Date(b.at))
      .forEach((entry) => {
        latest[entry.residentId] = entry;
      });
    return latest;
  }, [gateLog]);

  const currentlyOut = useMemo(
    () =>
      residents
        .filter((r) => gateState[r.id]?.type === "out")
        .map((r) => ({ ...r, entry: gateState[r.id] }))
        .sort((a, b) => new Date(a.entry.at) - new Date(b.entry.at)),
    [residents, gateState],
  );

  const logGate = useCallback(
    (residentId, type, reason) => {
      setGateLog((prev) => [
        {
          id: `G-${Date.now().toString().slice(-5)}`,
          residentId,
          type,
          at: new Date().toISOString(),
          reason: reason.trim() || (type === "out" ? "Signed out" : "Returned"),
        },
        ...prev,
      ]);
      const resident = residents.find((r) => r.id === residentId);
      toast.success(
        `${resident?.name ?? "Resident"} signed ${type === "out" ? "out" : "back in"}`,
      );
      setGateOpen(false);
    },
    [residents, toast],
  );

  const gateRows = useMemo(
    () =>
      gateLog.map((entry) => ({
        ...entry,
        resident: residents.find((r) => r.id === entry.residentId) ?? null,
      })),
    [gateLog, residents],
  );

  /* ---------------- Leave ---------------- */
  const leaveRows = useMemo(
    () =>
      leave.map((request) => ({
        ...request,
        resident: residents.find((r) => r.id === request.residentId) ?? null,
        nights: Math.max(
          1,
          Math.round(
            (parseDate(request.to).getTime() - parseDate(request.from).getTime()) /
              MS_DAY,
          ),
        ),
      })),
    [leave, residents],
  );

  const pendingLeave = useMemo(
    () => leaveRows.filter((r) => r.status === "pending"),
    [leaveRows],
  );

  /* Approving records the date the hostel expects them back through the
     gate — that is what the warden checks against. */
  const approveLeave = useCallback(
    (id) => {
      const request = leave.find((r) => r.id === id);
      if (!request) return false;
      if (!request.guardianApproved) {
        toast.error(
          "The guardian hasn't approved this yet — it can't be signed off.",
        );
        return false;
      }
      setLeave((prev) =>
        prev.map((r) =>
          r.id === id ?
            { ...r, status: "approved", expectedReturn: r.to }
          : r,
        ),
      );
      toast.success(`Approved — expected back on ${request.to}`);
      return true;
    },
    [leave, toast],
  );

  const rejectLeave = useCallback(
    (id) => {
      setLeave((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)),
      );
      toast.info("Leave request rejected");
    },
    [toast],
  );

  /* ---------------- Wardens ---------------- */
  /* A block × shift grid: any empty cell is a stretch with nobody on duty. */
  const wardenGrid = useMemo(
    () =>
      blocks.map((b) => ({
        ...b,
        shifts: SHIFTS.map((shift) => ({
          ...shift,
          warden:
            wardens.find((w) => w.blockId === b.id && w.shift === shift.value) ??
            null,
        })),
      })),
    [],
  );

  const uncovered = useMemo(
    () =>
      wardenGrid.flatMap((b) =>
        b.shifts.filter((s) => !s.warden).map((s) => ({ block: b, shift: s })),
      ),
    [wardenGrid],
  );

  /* ---------------- Residents directory ---------------- */
  const directory = useMemo(() => {
    const q = query.trim().toLowerCase();
    return residents
      .map((r) => ({ ...r, room: r.roomId ? roomRowById[r.roomId] : null }))
      .filter((r) => {
        if (blockFilter && r.room?.blockId !== blockFilter) return false;
        if (statusFilter === "housed" && !r.roomId) return false;
        if (statusFilter === "unassigned" && r.roomId) return false;
        if (statusFilter === "out" && gateState[r.id]?.type !== "out")
          return false;
        if (!q) return true;
        return (
          r.name.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.classId.toLowerCase().includes(q) ||
          (r.room?.number ?? "").includes(q)
        );
      });
  }, [residents, query, blockFilter, statusFilter, roomRowById, gateState]);

  /* ---------------- Tickets ---------------- */
  const ticketRows = useMemo(
    () =>
      tickets
        .map((t) => ({
          ...t,
          room: roomById[t.roomId] ?? null,
          age: daysSince(t.openedOn),
        }))
        .filter((t) => (ticketStatus ? t.status === ticketStatus : true))
        .sort((a, b) => {
          const openFirst = (x) => (x.status === "resolved" ? 1 : 0);
          return openFirst(a) - openFirst(b) || b.age - a.age;
        }),
    [tickets, ticketStatus],
  );

  const openTickets = useMemo(
    () => tickets.filter((t) => t.status !== "resolved"),
    [tickets],
  );

  const addTicket = useCallback(
    (ticket) => {
      setTickets((prev) => [
        {
          ...ticket,
          id: `TK-${Date.now().toString().slice(-5)}`,
          status: "open",
          openedOn: toIsoDate(new Date()),
        },
        ...prev,
      ]);
      setTicketOpen(false);
      toast.success("Maintenance ticket raised");
    },
    [toast],
  );

  const setTicketState = useCallback((id, status) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t)),
    );
  }, []);

  /* ---------------- Summary ---------------- */
  const summary = useMemo(
    () => ({
      beds: totals.beds,
      occupied: totals.occupied,
      out: currentlyOut.length,
      issues: openTickets.length,
    }),
    [totals, currentlyOut, openTickets],
  );

  const value = useMemo(
    () => ({
      /* reference */
      blocks,
      shifts: SHIFTS,
      residents,

      /* navigator */
      blockId,
      block,
      selectBlock,
      floor,
      setFloor,
      floorRooms,
      roomId,
      setRoomId,
      room,
      roomRows,
      roomRowById,

      /* occupancy */
      blockStats,
      totals,
      roomsWithSpace,

      /* allocation */
      canAllocate,
      allocate,
      unassign,
      unassigned,
      allocateFor,
      setAllocateFor,
      allocateFormRef,
      saving,

      /* directory */
      directory,
      query,
      setQuery,
      blockFilter,
      setBlockFilter,
      statusFilter,
      setStatusFilter,
      gateState,

      /* wardens */
      wardenGrid,
      uncovered,

      /* gate */
      gateRows,
      currentlyOut,
      logGate,
      gateOpen,
      setGateOpen,
      gateFormRef,

      /* leave */
      leaveRows,
      pendingLeave,
      approveLeave,
      rejectLeave,

      /* tickets */
      ticketRows,
      openTickets,
      ticketStatus,
      setTicketStatus,
      addTicket,
      setTicketState,
      ticketOpen,
      setTicketOpen,
      ticketFormRef,

      /* shell */
      activeTab,
      setActiveTab,
      summary,
    }),
    [
      residents,
      blockId,
      block,
      selectBlock,
      floor,
      floorRooms,
      roomId,
      room,
      roomRows,
      roomRowById,
      blockStats,
      totals,
      roomsWithSpace,
      canAllocate,
      allocate,
      unassign,
      unassigned,
      allocateFor,
      saving,
      directory,
      query,
      blockFilter,
      statusFilter,
      gateState,
      wardenGrid,
      uncovered,
      gateRows,
      currentlyOut,
      logGate,
      gateOpen,
      leaveRows,
      pendingLeave,
      approveLeave,
      rejectLeave,
      ticketRows,
      openTickets,
      ticketStatus,
      addTicket,
      setTicketState,
      ticketOpen,
      activeTab,
      summary,
    ],
  );

  return (
    <HostelContext.Provider value={value}>{children}</HostelContext.Provider>
  );
}

export function useHostel() {
  const ctx = useContext(HostelContext);
  if (!ctx) throw new Error("useHostel must be used inside <HostelProvider>");
  return ctx;
}
