import { memo, useEffect, useRef } from "react";

import { popGrade } from "@/animation/examPageAnimation";

/* One student per row. Memoised on the row object and the error that
   belongs to it, so typing in one cell doesn't re-render the sheet. */
const MarkRow = memo(function MarkRow({ row, rowIndex, error, onMark, onKeyNav }) {
  const gradeRef = useRef(null);
  const lastGrade = useRef(row.grade?.letter ?? null);

  useEffect(() => {
    const letter = row.grade?.letter ?? null;
    if (letter && letter !== lastGrade.current) popGrade(gradeRef.current);
    lastGrade.current = letter;
  }, [row.grade]);

  return (
    <tr className={`mark-sheet-row${row.complete ? "" : " is-partial"}`}>
      <th scope="row">
        <span className="mark-roll">{row.roll}</span>
        <span className="mark-student">
          {row.name}
          <span className="cell-sub">{row.classId}</span>
        </span>
      </th>

      {row.cells.map((cell, colIndex) => {
        const invalid = error?.code === cell.code;
        return (
          <td
            key={cell.code}
            className={`mark-cell${invalid ? " is-invalid" : ""}${
              cell.passed === false ? " is-failing" : ""
            }`}>
            <input
              type="number"
              min="0"
              max={cell.max}
              inputMode="numeric"
              aria-label={`${cell.code} mark for ${row.name}`}
              data-cell={`${rowIndex}-${colIndex}`}
              value={cell.score}
              onChange={(e) => onMark(row.id, cell.code, e.target.value)}
              onKeyDown={(e) => onKeyNav(e, rowIndex, colIndex)}
            />
            {cell.percent !== null && (
              <span className={`mark-grade mark-grade--${cell.grade.tone}`}>
                {cell.grade.letter}
              </span>
            )}
          </td>
        );
      })}

      {/* Live preview — recomputed from the row, never stored. */}
      <td className="mark-total">
        {row.weighted === null ?
          <span className="cell-sub">—</span>
        : <>
            <strong>{row.weighted}%</strong>
            <span
              className={`mark-grade mark-grade--${row.grade.tone}`}
              ref={gradeRef}>
              {row.grade.letter}
            </span>
            <span className="cell-sub">GPA {row.gpa}</span>
          </>
        }
      </td>
    </tr>
  );
});

export default MarkRow;
