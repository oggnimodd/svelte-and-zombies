<script lang="ts">
  import { tv } from "tailwind-variants";

  interface SliderProps {
    value: number;
    min: number;
    max: number;
    label: string;
    onChange: (value: number) => void;
    disabled?: boolean;
    size?: "sm" | "md" | "lg";
    variant?: "default" | "success" | "warning";
  }

  const {
    value,
    min,
    max,
    label,
    onChange,
    disabled = false,
    size = "md",
    variant = "default",
  }: SliderProps = $props();

  const slider = tv({
    slots: {
      container: [
        "group relative flex items-center gap-3 rounded-lg border-2 p-2",
        "transition-all duration-300 ease-out",
        "backdrop-blur-sm",
        "hover:scale-[1.01] active:scale-[0.99]",
        "w-full flex-wrap",
      ],
      label: "font-bold transition-colors duration-200 w-full sm:w-auto",
      value: "font-bold text-center transition-colors duration-200",
      input: [
        "appearance-none rounded-lg flex-1",
        "transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 max-w-full",
      ],
    },
    variants: {
      variant: {
        default: {
          container: "border-lime-400/30 bg-lime-400/10 hover:bg-lime-400/20",
          label: "text-lime-400",
          value: "text-lime-400",
          input: "bg-lime-400/30 focus:ring-lime-400/50",
        },
        success: {
          container:
            "border-emerald-400/30 bg-emerald-400/10 hover:bg-emerald-400/20",
          label: "text-emerald-400",
          value: "text-emerald-400",
          input: "bg-emerald-400/30 focus:ring-emerald-400/50",
        },
        warning: {
          container:
            "border-amber-400/30 bg-amber-400/10 hover:bg-amber-400/20",
          label: "text-amber-400",
          value: "text-amber-400",
          input: "bg-amber-400/30 focus:ring-amber-400/50",
        },
      },
      size: {
        sm: {
          container: "p-1.5 gap-2",
          label: "text-sm",
          value: "text-sm",
        },
        md: {
          container: "p-2 gap-3",
          label: "text-base",
          value: "text-base",
        },
        lg: {
          container: "p-3 gap-4",
          label: "text-lg",
          value: "text-lg",
        },
      },
      disabled: {
        true: {
          container: "opacity-50 cursor-not-allowed hover:scale-100",
          input: "cursor-not-allowed",
        },
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  });

  const styles = $derived(slider({ variant, size, disabled }));

  const updateValue = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const newValue = parseFloat(target.value);
    if (!disabled) onChange(newValue);
  };
</script>

<div class={styles.container()}>
  <span class={styles.label()}>{label}</span>
  <input
    type="range"
    {min}
    {max}
    {value}
    {disabled}
    oninput={updateValue}
    class={styles.input()}
  />
  <span class={styles.value()}>{value.toFixed(1)}</span>
</div>

<style>
  input[type="range"] {
    height: 8px;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: currentColor;
    cursor: pointer;
    border: 2px solid currentColor;
    transition: all 0.2s ease;
  }

  input[type="range"]::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: currentColor;
    cursor: pointer;
    border: 2px solid currentColor;
    transition: all 0.2s ease;
  }

  input[type="range"]::-webkit-slider-runnable-track,
  input[type="range"]::-moz-range-track {
    height: 8px;
    border-radius: 9999px;
    transition: all 0.2s ease;
  }

  input[type="range"]:not(:disabled):hover::-webkit-slider-thumb {
    transform: scale(1.1);
  }

  input[type="range"]:not(:disabled):hover::-moz-range-thumb {
    transform: scale(1.1);
  }
</style>
