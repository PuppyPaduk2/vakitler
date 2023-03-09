import { useContext, useEffect, useState } from "react";
import { CommonStoreContext } from "@/stores/common";
import { cx } from "@/lib/utils";
import { motion } from "framer-motion";
import TimeLocation from "@/components/time-location";
import TimeSummary from "@/components/time-summary";
import TimeList from "@/components/time-list";
import TimeTravel from "@/components/time-travel";

export default function Index() {
  const { times } = useContext(CommonStoreContext);

  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!times) return;
    setStart(true);
  }, [times]);

  if (!times) return null;

  return (
    <motion.div
      initial={false}
      animate={start ? "open" : "closed"}
      className={cx(
        "h-full select-none",
        "grid grid-rows-[minmax(auto,_1fr)_minmax(auto,_480px)]",
        "md:grid-rows-[minmax(auto,_1fr)_minmax(auto,_600px)]"
      )}
    >
      <TimeLocation />
      <TimeSummary />
      <TimeList />
      <TimeTravel />
    </motion.div>
  );
}
