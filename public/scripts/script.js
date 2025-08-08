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

async function handleSubmit(event) {
  event.preventDefault();
  const formData = new FormData(document.getElementById("signup-form"));
  try {
    const response = await fetch("/signup", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData.entries())),
    });
    if (!response.ok) throw new Error("There is something wrong");
    else {
      const result = await response.json();
      if (result.errors) {
        document.getElementById("error-container").textContent = "";
        result.errors.forEach((val) => {
          const errorMsg = document.createElement("p");
          errorMsg.classList.add("text-error");
          errorMsg.textContent = val.msg;
          document.getElementById("error-container").append(errorMsg);
        });
      } else window.location.href = "/";
    }
  } catch (err) {
    console.log(err);
  }
}
function cb() {
  return confirm("Are your sure?");
}
