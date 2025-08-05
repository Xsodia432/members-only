const form = document.getElementById("create-form");
const errorContainer = document.getElementById("error-container");

form.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const formData = new FormData(form);
  try {
    const response = await fetch("/create", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData.entries())),
    });
    if (!response.ok) console.log("There is something wrong.");
    else {
      const result = await response.json();
      errorContainer.textContent = "";
      if (result.errors) {
        result.errors.forEach((val) => {
          const errorEle = document.createElement("p");
          errorEle.classList.add("text-error");
          errorEle.textContent = val.msg;
          errorContainer.append(errorEle);
        });
      } else window.location.href = "/";
    }
  } catch (err) {
    console.log(err);
  }
});
