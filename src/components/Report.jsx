import {useMemo} from "react";
import { totalTaskIco, pendingIco, completedIco, overdueIco, frozenIco, docIco, pencilIco } from '../icons';

function Report({tasks, description, attachments}) {
    const stats = useMemo(() => {
        const todayStr = new Date().toISOString().slice(0, 10);

        let pending = 0;
        let completed = 0;
        let frozen = 0;
        let overdue = 0;

        for (const task of tasks) {
            const isCompleted = task.status === "Completed";

            if (task.status === "In Review") pending += 1;
            if (isCompleted) completed += 1;
            if (task.status === "Frozen") frozen += 1;
            if (!isCompleted && task.dueDate && task.dueDate < todayStr) overdue += 1;
        }

        return {total: tasks.length, pending, completed, frozen, overdue}
    }, [tasks]);

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
                    <h3>Decription <button type="button" className="pencil-button">{pencilIco}</button></h3>
                    <p>{description}</p>
                </div>
                <div className="report-panel">
                    <h3>Attachments <button type="button" className="pencil-button">{pencilIco}</button></h3>
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