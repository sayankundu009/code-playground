export default function IconButton({ active = false, children }: { active?: boolean, children: React.ReactNode }) {
    const activeClass = active ? "active" : "";

    return (
        <div className="icon-button avatar placeholder" role="button">
            <div className={`icon-button-holder mb-8 rounded-full w-10 h-10 ${activeClass} text-white text-xl`}>
                {children}
            </div>
        </div>
    );
}
