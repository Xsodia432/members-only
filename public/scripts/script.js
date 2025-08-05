const profileButton = document.getElementById("profile-container");
const profileContainer = document.getElementById("profile-content");

profileButton.addEventListener("click", (ev) => {
  ev.stopPropagation();
  document.getElementById("profile-content").classList.toggle("show");
});
document.addEventListener("click", (ev) => {
  if (
    !profileContainer.contains(ev.target) &&
    !profileButton.contains(ev.target)
  ) {
    profileContainer.classList.remove("show");
  }
});
