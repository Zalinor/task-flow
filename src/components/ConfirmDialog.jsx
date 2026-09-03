import { crossIco } from "../icons";

function ConfirmDialog ({title, message, confirmLabel = "Delete", onConfirm, onCancel}) {
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal confirm-dialog" onClick={(event) => event.stopPropagation()}>
                <button type="button" className="modal-header-button" onClick={onCancel}>{crossIco}</button>
                <div>
                  <h3>{title}</h3>
                    <p>{message}</p>
                    <div className="modal-actions">
                        <button type="button" onClick={onCancel}>Cancel</button>
                        <button type="submit" className="confirm-delete-button" onClick={onConfirm}>
                            {confirmLabel}
                        </button>
                    </div>  
                </div>
                
            </div>
        </div>
    );
}

export default ConfirmDialog;