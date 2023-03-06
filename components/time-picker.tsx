import React, { useCallback, useContext } from "react";
import { CommonStoreContext } from "@/stores/common";

export default function TimePicker() {
  const { devLocalTime, setDevLocalTime, fetchData } =
    useContext(CommonStoreContext);

  const onNowClick = useCallback(() => {
    setDevLocalTime([0, 0, 0]);
  }, [setDevLocalTime]);

  return (
    <div className="fixed bottom-0 z-30 grid w-full place-items-center rounded shadow-lg">
      <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2">
        <input
          type="number"
          className="h-6 w-12 rounded bg-zinc-100 pl-2"
          value={devLocalTime[0]}
          onChange={e => {
            const value = parseInt(e.target.value);
            if (!isNaN(value)) {
              setDevLocalTime([value, devLocalTime[1], devLocalTime[2]]);
            }
          }}
        />
        <input
          type="number"
          className="h-6 w-12 rounded bg-zinc-100 pl-2"
          value={devLocalTime[1]}
          onChange={e => {
            const value = parseInt(e.target.value);
            if (!isNaN(value)) {
              setDevLocalTime([devLocalTime[0], value, devLocalTime[2]]);
            }
          }}
        />
        <input
          type="number"
          className="h-6 w-12 rounded bg-zinc-100 pl-2"
          value={devLocalTime[2]}
          onChange={e => {
            const value = parseInt(e.target.value);
            if (!isNaN(value)) {
              setDevLocalTime([devLocalTime[0], devLocalTime[1], value]);
            }
          }}
        />
        <button onClick={onNowClick}>Clear</button>
      </div>
    </div>
  );
}
