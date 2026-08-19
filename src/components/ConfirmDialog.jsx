function ConfirmDialog ({title, message, confirmLabel = "Delete", onConfirm, onCancel}) {
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal confirm-dialog" onClick={(event) => event.stopPropagation()}>
                <h3>{title}</h3>
                <p>{message}</p>
                <div className="modal-actions">
                    <button type="button" onClick={onCancel}>Cancel</button>
                    <button type="button" className="confirm-delete-button" onClick={onConfirm}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;