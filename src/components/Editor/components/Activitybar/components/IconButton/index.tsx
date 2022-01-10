export default function IconButton({ active = false, children }: { active?: boolean, children: React.ReactNode }) {

    const activeClass = active ? "bg-secondary" : "bg-main";

    return (
        <div className="icon-button avatar placeholder" role="button">
            <div className={`mb-8 rounded-full w-10 h-10 ${activeClass} text-white text-xl`}>
                {children}
            </div>
        </div>
    )
}
