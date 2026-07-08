import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    CircularProgress
} from '@mui/material';

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    title,
    message,
    onConfirm,
    onCancel,
    isLoading = false,
    confirmText = "Confirm",
    cancelText = "Cancel"
}) => {
    return (
        <Dialog open={open} onClose={!isLoading ? onCancel : undefined} maxWidth="xs" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Typography variant="body1">{message}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} disabled={isLoading} color="inherit">
                    {cancelText}
                </Button>
                <Button onClick={onConfirm} disabled={isLoading} color="error" variant="contained">
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
