export const BASE_URL = "http://localhost:4000"; /* http://localhost:4000 */

export const ENDPOINTS = {
  POSTS: "/posts",
  SEARCH: "/search",
  LOGIN: "/auth/login",
  CHECK_PASSWORD_STRENGTH: "/auth/checkPasswordStrength",
  SIGNUP: "/auth/signup",
  REFRESH: "/auth/refresh",
  CHECK_USERNAME:"/auth/checkusername",
  LOGOUT:"/auth/logout",
  EVENTS: {
    BASE: "/events",
    DETAILS: (id: string | number) => `/events/${id}`,
    PARTICIPANTS: (id: string | number) => `/events/${id}/participants`,
    ATTEND: (id: string | number) => `/events/${id}/attendEvent`,
    LEAVE: (id: string | number) => `/events/${id}/leaveEvent`,
    CREATE: `/events/createEvent`
  },
  USERS: {
    GET_USER_CONTENT_TYPE: "/users/usersContent",
    GET_USER_PROFILE: "/users"
  },
  PROFILE: {
    UPDATE_PROFILE_PIC: "/profile/updateProfilePic",
    UPDATE_PROFILE_INFO: "/profile/updateProfileInfo",
    GET_PROFILE_INFO: "/profile/profileInfo",
  },
  COMMENTS: (postId?: number | string) =>`/posts/${postId}/comments`,
  REPLIES: (commentId?: number | string) => `/posts/comments/${commentId}/replies`,
  AWS: {
    UPLOAD_EVENT_BANNER: "/aws/uploadEventBanner",
    UPLOAD_PROFILE_PIC: "/aws/uploadProfilePic"
  }
};
