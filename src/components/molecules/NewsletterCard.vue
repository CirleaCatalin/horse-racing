<template>
  <div
    class="newsletter border-accent-border bg-nav-bg mx-2.5 mt-2.5 mb-1 flex shrink-0 flex-col gap-[5px] rounded-lg border px-[13px] pt-3.5 pb-4 shadow-[0_0_0_1px_var(--color-accent-glass)_inset,0_6px_28px_rgba(0,0,0,0.45),0_0_18px_var(--color-accent-tint)] backdrop-blur-[8px]"
  >
    <p
      class="newsletter-label font-ui text-accent mb-0.5 text-[9px] font-bold tracking-[1.4px] uppercase"
    >
      Newsletter
    </p>
    <p
      class="newsletter-title font-ui text-text-primary text-[13px] leading-[1.25] font-black tracking-[0.1px]"
    >
      Stay ahead of the race.
    </p>
    <p
      class="newsletter-sub font-ui text-text-quiet mb-1.5 text-[10px] leading-[1.5] font-normal"
    >
      Live results &amp; expert picks, straight to your inbox.
    </p>
    <div class="newsletter-form flex flex-col gap-[7px]">
      <input
        class="newsletter-input border-accent-glass bg-surface font-ui text-text-bright placeholder:text-text-faint focus:border-accent-heavy focus:bg-text-ghost h-8 w-full rounded-sm border px-[11px] text-[10px] transition-[border-color,background] duration-[0.18s] ease-[ease] outline-none"
        type="email"
        placeholder="your@email.com"
      />
      <button
        class="newsletter-btn btn-gradient-newsletter font-ui h-8 w-full cursor-pointer rounded-sm border-none text-[11px] font-extrabold tracking-[0.8px] text-white uppercase shadow-[0_3px_12px_var(--color-accent-strong)] transition-[opacity,transform] duration-[0.18s] ease-[ease] hover:opacity-88 active:scale-[0.97]"
      >
        Subscribe
      </button>
    </div>
  </div>
</template>
