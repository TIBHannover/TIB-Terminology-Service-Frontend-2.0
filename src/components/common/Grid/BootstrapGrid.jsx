export function rowWithSingleColumn({content, columnClass}){
    return [
        <div className="row">
            <div className={columnClass}>
                {content}
            </div>
        </div>
    ];
}