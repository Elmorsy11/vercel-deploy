
export const HandleMsg = (err) => {
  const lang = localStorage.getItem("language");
  let msg = "something goes wrong, please try again later";
  if (err?.message) {
    msg = err.message;
  }
  if (lang == "en" && err?.enMessage) {
    msg = err.enMessage;
  }
  if (lang == "ar" && err?.arMessage) {
    msg = err.arMessage;
  }
  return msg
}
