import gsap from "gsap";
import { showToast } from "../../hooks/useToast";
export function refreshActivityFeed() {
  document
    .getElementById("refreshActivityBtn")
    .addEventListener("click", (e) => {
      if (gsap)
        gsap.to(e.currentTarget.querySelector("svg"), {
          rotate: "+=360",
          duration: 0.5,
          ease: "power2.out",
        });
      showToast("Activity feed refreshed");
    });
}
