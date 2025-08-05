const questionHandler = async () => {
  try {
    const response = await fetch(
      "https://the-trivia-api.com/api/questions?limit=1"
    );
    if (!response.ok)
      throw new Error("There is something wrong, try again later");
    const data = await response.json();
    const questionEle = document.createElement("p");
    const questionEleEm = document.createElement("em");
    questionEleEm.textContent = data[0].question;
    questionEle.append(questionEleEm);
    document.getElementById("question-container").append(questionEle);

    submitHandler(data[0].correctAnswer);
  } catch (err) {
    throw new Error(err);
  }
};

const submitHandler = (answer) => {
  console.log(answer);
  document
    .getElementById("member-form")
    .addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const formData = new FormData(document.getElementById("member-form"));
      try {
        const response = await fetch("/membership", {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            ...Object.fromEntries(formData.entries()),
            answer: answer,
          }),
        });
        if (!response.ok)
          console.log("There is something wrong please try again");
        else {
          const result = await response.json();

          if (result.errors) {
            document.getElementById("error-container").textContent = "";
            result.errors.forEach((val) => {
              const errorEle = document.createElement("p");
              errorEle.classList.add("text-error");
              errorEle.textContent = val.msg;
              document.getElementById("error-container").append(errorEle);
            });
          } else {
            document.getElementById("member-form").textContent = "";
            const msgEle = document.createElement("p");
            msgEle.textContent = result.msg;
            document.getElementById("member-form").append(msgEle);
            setTimeout(() => {
              window.location.href = "/";
            }, 3000);
          }
        }
      } catch (err) {
        console.log(err);
      }
    });
};
questionHandler();
