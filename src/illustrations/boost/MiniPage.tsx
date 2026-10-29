/** The fake "designweekly.example" page that the Boost recolours. */
export function MiniPage({ accent }: { accent: string }) {
  return (
    <div className="h-full w-full bg-[#fff7f2] px-6 pt-4 text-[#2a2230]">
      <div className="flex items-center justify-between">
        <span className="font-serif text-[13px] font-semibold tracking-tight">Design Weekly</span>
        <div className="flex gap-3">
          <span className="h-1.5 w-8 rounded-full bg-[#2a2230]/15" />
          <span className="h-1.5 w-10 rounded-full bg-[#2a2230]/15" />
          <span
            className="h-1.5 w-8 rounded-full transition-colors duration-700 ease-out"
            style={{ backgroundColor: accent }}
          />
        </div>
      </div>
      <h3 className="mt-5 font-serif text-[22px] leading-7 font-semibold tracking-tight">
        Quiet design,
        <br />
        <span className="transition-colors duration-700 ease-out" style={{ textDecorationColor: accent }}>
          every Friday.
        </span>
      </h3>
      <div className="mt-3 flex items-center gap-3">
        <span
          className="inline-flex h-7 items-center rounded-full px-3.5 text-xs font-medium text-[#2a2230] transition-colors duration-700 ease-out"
          style={{ backgroundColor: accent }}
        >
          Subscribe
        </span>
        <span className="h-1.5 w-20 rounded-full bg-[#2a2230]/12" />
      </div>
    </div>
  );
}
