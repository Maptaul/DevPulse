export const USER_ROLE = {
  contributor: "contributor",
  maintainer: "maintainer",
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
export type ROLES = UserRole;
