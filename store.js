import { create } from "zustand";

const useStore = create((set) => ({
  user: {},
  userprofile:{},
  setuser: (userdata) => set({ user: userdata }),
  setuserprofile: (userprofiledata) => set({ userprofile: userprofiledata }),
}));

export default useStore;
