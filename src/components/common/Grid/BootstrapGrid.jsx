export function rowWithSingleColumn({content, rowClass, columnClass}){
    return [
        <div className={"row " + rowClass}>
            <div className={columnClass}>
                {content}
            </div>
        </div>
    ];
}