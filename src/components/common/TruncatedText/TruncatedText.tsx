const TruncatedText = (props: { text: string, length: number }) => {
    const {text, length} = props;
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        let fullDescp = e.currentTarget.getAttribute("data-value") ?? "";
        let p = e.currentTarget.previousElementSibling;
        if (!p) {
            return
        }
        if (e.currentTarget.textContent === "[Read more]") {
            p.textContent = fullDescp;
            e.currentTarget.textContent = "[Read less]"
        } else {
            p.textContent = fullDescp.substring(0, length) + " ... ";
            e.currentTarget.textContent = "[Read more]"
        }
    }
    return (
        <>
            <p className="trunc-text d-inline-block">{text.substring(0, length) + " ... "}</p>
            <a className="read-more-btn" data-value={text} onClick={handleClick}>
                [Read more]
            </a>
        </>
    );
}

export default TruncatedText;