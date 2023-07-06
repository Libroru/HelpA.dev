import { persisted } from "svelte-local-storage-store";


export const userData = persisted('userData', {
    uid: "null",
    username: "null"
})