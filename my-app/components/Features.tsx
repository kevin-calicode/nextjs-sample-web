export type Feature = {title: string; desc: string};

export function Features({items}: {items: Feature[]}) {
    return (
        <section className="grid gap-6 sm:grid-cols-3">
            {items.map((f, i) => (
                <div key={i} className="rounded-xl border shadow-sm p-6">
                    <h3 className="font-semibold">{f.title}</h3>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{f.desc}</p>
                </div>
            ))}
        </section>
    );
}
