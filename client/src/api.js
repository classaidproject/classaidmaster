//Base URL
// const base_url = "http://localhost:3000/api/";
const base_url = "https://backend-class-aid.herokuapp.com/api/";
const user_url = "user/";
const course_url = "course/";
const enroll_url = "enroll/";
const quiz_url = "quiz/";
const file_url = "file/";

export const userDetailURL = () => `${base_url}${user_url}alluser`;
export const singelUserDetailURL = (id) => `${base_url}${user_url}detail/${id}`;
export const loginURL = () => `${base_url}${user_url}login`;
export const refreshLoginURL = () => `${base_url}${user_url}refreshLogin`;
export const signupURL = () => `${base_url}${user_url}register`;
export const updateProfileURL = (userId) =>
  `${base_url}${file_url}profile/${userId}`;
export const addCourseURL = () => `${base_url}${course_url}add`;
export const getAllCourseURL = () => `${base_url}${enroll_url}`;
export const selectedCourseURL = (classId) =>
  `${base_url}${enroll_url}class/${classId}`;
export const rankingURL = (id) => `${base_url}${enroll_url}ranking/${id}`;
export const enrollURL = () => `${base_url}${enroll_url}enrollCourse`;
export const waitListChangeURL = () => `${base_url}${enroll_url}waitListAccept`;
export const unenrollURL = () => `${base_url}${enroll_url}unenroll`;
export const waitListURL = (id) =>
  `${base_url}${enroll_url}class/waitlist/${id}`;
export const classListURL = (id) => `${base_url}${enroll_url}student/${id}`;
export const singleCourseDetailURL = (id) =>
  `${base_url}${course_url}detail/${id}`;
export const createQuizURL = (id) => `${base_url}${quiz_url}${id}/add`;
export const getQuizURL = (id) => `${base_url}${quiz_url}${id}`;
export const recordScoreURL = (id, quizId) =>
  `${base_url}${enroll_url}student/${id}/quiz/${quizId}`;
export const removeQuizURL = (courseId, quizId) =>
  `${base_url}${quiz_url}${courseId}/remove/${quizId}`;
export const removeCourseURL = (id) => `${base_url}${course_url}remove/${id}`;
export const messageURL = (courseId) =>
  `${base_url}${course_url}message/course/${courseId}`;
export const userwaitListURL = (id) =>
  `${base_url}${enroll_url}user/waitlist/${id}`;
export const fileUploadURL = (courseId, userId) =>
  `${base_url}${file_url}${courseId}/${userId}`;
export const fetchFileURL = (courseId) => `${base_url}${file_url}${courseId}`;
