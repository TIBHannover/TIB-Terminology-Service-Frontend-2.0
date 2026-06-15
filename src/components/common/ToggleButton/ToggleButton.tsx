import { useEffect } from "react";
import "../../layout/toggleButton.css";

type ToggleButtonProps = {
  on: boolean;
  onClickCallback?: React.MouseEventHandler<HTMLInputElement>;
  onLabel: React.ReactNode;
  offLabel: React.ReactNode;
  tooltipText?: string;
};

export const ToggleButton = ({
  on,
  onClickCallback,
  onLabel,
  offLabel,
  tooltipText,
}: ToggleButtonProps) => {
  useEffect(() => {
    const toggleBtn = document.getElementById(
      "toggleBtn",
    ) as HTMLInputElement | null;
    if (toggleBtn) {
      toggleBtn.checked = on;
    }
  }, []);

  return (
    <label className="toggleButtonLabel">
      <input
        type="checkbox"
        id="toggleBtn"
        onClick={onClickCallback}
        checked={on}
      />
      <div
        className={"toggle-slider round " + (!on ? "toggle-slider-off" : "")}
        title={tooltipText}
      >
        {on ? (
          <span className="toggleButton-on truncate-toggleButtonLabel">
            {onLabel}
          </span>
        ) : (
          <span className="toggleButton-off truncate-toggleButtonLabel">
            {offLabel}
          </span>
        )}
      </div>
    </label>
  );
};
