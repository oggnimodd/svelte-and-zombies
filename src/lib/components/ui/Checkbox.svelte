<script lang="ts">
  import IconCheck from "@tabler/icons-svelte/icons/check";
  import { tv } from "tailwind-variants";

  interface CheckboxProps {
    checked: boolean;
    label: string;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    size?: "sm" | "md" | "lg";
    variant?: "default" | "success" | "warning";
  }

  const {
    checked,
    label,
    onChange,
    disabled = false,
    size = "md",
    variant = "default",
  }: CheckboxProps = $props();

  const checkbox = tv({
    slots: {
      base: [
        "group relative flex items-center gap-3 rounded-lg border-2 p-2",
        "transition-all duration-300 ease-out",
        "backdrop-blur-sm",
        "hover:scale-[1.01] active:scale-[0.99]",
        "w-full",
      ],
      indicator: [
        "relative overflow-hidden rounded-md border-2",
        "flex items-center justify-center",
        "transition-all duration-300",
      ],
      iconWrapper: [
        "absolute inset-0",
        "flex items-center justify-center",
        "transition-all duration-300",
      ],
      label: "font-bold tracking-wide transition-all duration-200",
    },
    variants: {
      variant: {
        default: {
          base: "border-lime-400/30 bg-lime-400/10 hover:bg-lime-400/20",
          indicator: "border-lime-400/50 bg-lime-400/10",
          label: "text-lime-400",
          iconWrapper: "text-lime-400",
        },
        success: {
          base: "border-emerald-400/30 bg-emerald-400/10 hover:bg-emerald-400/20",
          indicator: "border-emerald-400/50 bg-emerald-400/10",
          label: "text-emerald-400",
          iconWrapper: "text-emerald-400",
        },
        warning: {
          base: "border-amber-400/30 bg-amber-400/10 hover:bg-amber-400/20",
          indicator: "border-amber-400/50 bg-amber-400/10",
          label: "text-amber-400",
          iconWrapper: "text-amber-400",
        },
      },
      size: {
        sm: {
          indicator: "h-4 w-4",
          iconWrapper: "text-sm",
        },
        md: {
          indicator: "h-6 w-6",
          iconWrapper: "text-base",
        },
        lg: {
          indicator: "h-8 w-8",
          iconWrapper: "text-lg",
        },
      },
      checked: {
        true: {
          indicator: "bg-current bg-opacity-20",
          iconWrapper: "scale-100 opacity-100",
        },
        false: {
          indicator: "bg-transparent",
          iconWrapper: "scale-75 opacity-0",
        },
      },
      disabled: {
        true: {
          base: "opacity-50 cursor-not-allowed hover:scale-100",
        },
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  });

  const styles = $derived(checkbox({ variant, size, checked, disabled }));
</script>

<button
  role="checkbox"
  aria-checked={checked}
  {disabled}
  onclick={() => {
    if (!disabled) onChange(!checked);
  }}
  class={styles.base()}
>
  <div class={styles.indicator()}>
    <div class={styles.iconWrapper()}>
      <IconCheck />
    </div>
  </div>
  <span class={styles.label()}>{label}</span>
</button>
