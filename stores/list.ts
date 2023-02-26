import { create } from "zustand";
import { Data, ViewNames } from "@/lib/types";
import { Times } from "@/lib/model";

interface State {
  view: ViewNames;
  setView: (view: ViewNames) => void;
  loading: boolean;
  setLoading: (state: boolean) => void;
  data: Data;
  setData: (data: Data) => void;
  times: Times | undefined;
  fetchData: () => Promise<void>;
  timer: undefined | [string, string, string];
  updateTimer: () => void;
}

const store = create<State>((set, get) => ({
  view: ViewNames.Timer,
  setView: (view) => set(() => ({ view })),
  loading: true,
  setLoading: (state) => set(() => ({ loading: state })),
  data: null,
  setData: (data) => set(() => ({ data })),
  times: undefined,
  fetchData: async () => {
    const { setLoading, setData } = get();

    try {
      setLoading(true);
      const res = await fetch("/api");
      const data = await res.json();

      const times = new Times(data.times);
      set(() => ({ times }));

      setData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  },
  timer: undefined,
  updateTimer: () => {
    const { times } = get();
    if (!times) return;
    const timer = times.timer;
    set(() => ({ timer }));
  },
}));

export default store;
