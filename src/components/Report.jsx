import {useMemo} from "react";

const totalTaskIco = <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.5 3.26318H17.5" stroke="#0000FF" stroke-width="1.63" stroke-linecap="square" stroke-linejoin="round"/>
<path d="M2.5 10H17.5" stroke="#0000FF" stroke-width="1.63" stroke-linecap="square" stroke-linejoin="round"/>
<path d="M2.5 16.7368H17.5" stroke="#0000FF" stroke-width="1.63" stroke-linecap="square" stroke-linejoin="round"/>
</svg>
const pendingIco = <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.1488 1.08301C15.7906 1.84875 17.1796 3.06755 18.1522 4.59596C19.1248 6.12438 19.6407 7.89881 19.639 9.71046C19.639 12.2066 18.6474 14.6005 16.8823 16.3656C15.1173 18.1306 12.7234 19.1222 10.2272 19.1222C7.73104 19.1222 5.33712 18.1306 3.57208 16.3656C1.80703 14.6005 0.815434 12.2066 0.815434 9.71046C0.813735 7.89881 1.32955 6.12438 2.30218 4.59596C3.27481 3.06755 4.66377 1.84875 6.30563 1.08301" stroke="#DA843D" stroke-width="1.63" stroke-linecap="square" stroke-linejoin="round"/>
</svg>
const completedIco = <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.833008" y="0.833252" width="20" height="20" rx="10" stroke="#00B72B" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6.66602 11.6666L9.16602 14.1666L14.9993 8.33325" stroke="#00B72B" stroke-width="1.66667" stroke-linecap="square" stroke-linejoin="round"/>
</svg>
const overdueIco = <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.833008" y="0.833252" width="20" height="20" rx="10" stroke="#F30004" stroke-width="1.66667" stroke-miterlimit="10"/>
<path d="M10.833 11.6666V5.83325" stroke="#F30004" stroke-width="1.66667" stroke-linecap="square" stroke-linejoin="round"/>
<path d="M10.833 16.6665C11.5234 16.6665 12.083 16.1069 12.083 15.4165C12.083 14.7261 11.5234 14.1665 10.833 14.1665C10.1427 14.1665 9.58301 14.7261 9.58301 15.4165C9.58301 16.1069 10.1427 16.6665 10.833 16.6665Z" fill="#F30004"/>
</svg>
const frozenIco = <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.833008" y="0.833252" width="20" height="20" rx="10" stroke="#6C6C6C" stroke-width="1.66667" stroke-miterlimit="10"/>
<path d="M8.33301 7.5V14.1667" stroke="#6C6C6C" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.333 7.5V14.1667" stroke="#6C6C6C" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
const docIco = <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.4997 1.66675H4.99967C4.55765 1.66675 4.13372 1.84234 3.82116 2.1549C3.5086 2.46746 3.33301 2.89139 3.33301 3.33341V16.6667C3.33301 17.1088 3.5086 17.5327 3.82116 17.8453C4.13372 18.1578 4.55765 18.3334 4.99967 18.3334H14.9997C15.4417 18.3334 15.8656 18.1578 16.1782 17.8453C16.4907 17.5327 16.6663 17.1088 16.6663 16.6667V5.83341L12.4997 1.66675Z" stroke="#6C6C6C" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.667 1.66675V5.00008C11.667 5.44211 11.8426 5.86603 12.1551 6.17859C12.4677 6.49115 12.8916 6.66675 13.3337 6.66675H16.667" stroke="#6C6C6C" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
</svg>



function Report({tasks, finalColumnId, description, attachments}) {
    const stats = useMemo(() => {
        const todayStr = new Date().toISOString().slice(0, 10);

        let pending = 0;
        let completed = 0;
        let frozen = 0;
        let overdue = 0;

        for (const task of tasks) {
            const isCompleted = finalColumnId !== null && task.ColumnId === finalColumnId;

            if (task.status === "In Review") pending += 1;
            if (isCompleted) completed += 1;
            if (task.status === "Frozen") frozen += 1;
            if (!isCompleted && task.dueDate && task.dueDate < todayStr) overdue += 1;
        }

        return {total: tasks.length, pending, completed, frozen, overdue}
    }, [tasks, finalColumnId]);

    return (
        <div className="report">
            <div className="report-stats">
                <div className="report-card">
                    <span className="report-card-icon report-icon-total">{totalTaskIco}</span>
                    <div>
                        <p className="report-card-label">Total tasks</p>
                        <p className="report-card-value report-value-total">{stats.total}</p>
                    </div>
                </div>
                <div className="report-card">
                    <span className="report-card-icon report-icon-pending">{pendingIco}</span>
                    <div>
                        <p className="report-card-label">Pending</p>
                        <p className="report-card-value report-value-pending">{stats.pending}</p>
                    </div>
                </div>
                <div className="report-card">
                    <span className="report-card-icon report-icon-completed">{completedIco}</span>
                    <div>
                        <p className="report-card-label">Completed</p>
                        <p className="report-card-value report-value-completed">{stats.completed}</p>
                    </div>
                </div>
                <div className="report-card">
                    <span className="report-card-icon report-icon-overdue">{overdueIco}</span>
                    <div>
                        <p className="report-card-label">Overdue</p>
                        <p className="report-card-value report-value-overdue">{stats.overdue}</p>
                    </div>
                </div>
                <div className="report-card">
                    <span className="report-card-icon report-icon-frozen">{frozenIco}</span>
                    <div>
                        <p className="report-card-label">Frozen</p>
                        <p className="report-card-value report-value-frozen">{stats.frozen}</p>
                    </div>
                </div>
            </div>

            <div className="report-bottom">
                {/* Static for now  */}
                <div className="report-panel">
                    <h3>Decription <button type="button" className="pencil-button">✎</button></h3>
                    <p>{description}</p>
                </div>
                <div className="report-panel">
                    <h3>Attachments <button type="button" className="pencil-button">✎</button></h3>
                    <ul className="attachments-list">
                        {attachments.map((file) => (
                            <li key={file.name}>
                                <span className="attachment-icon">{docIco}</span>
                                <div>
                                    <p className="attachment-name">{file.name}</p>
                                    <p className="attachment-meta">{file.meta}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Report;