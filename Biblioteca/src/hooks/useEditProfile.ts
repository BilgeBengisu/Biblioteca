import { updateProfileById } from "../services/profiles";

export function useEditProfile() {
  return { updateProfile: updateProfileById };
}
