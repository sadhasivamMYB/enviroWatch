// Reusable MUI Table component with dynamic headers, rows, and optional action buttons
import React from "react";
import {
    TableContainer,
    Paper,
    Table as MuiTable,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Tooltip,
} from "@mui/material";

/**
 * Column definition for the table.
 * - `id` is the key used to access the row value when no custom `render` is supplied.
 * - `label` is the header text displayed.
 * - `render` (optional) allows custom cell rendering; receives the whole row.
 */
export interface TableColumn<RowType = any> {
    /** Unique identifier used to fetch the cell value from a row */
    id: keyof RowType;
    /** Header label displayed in the table head */
    label: string;
    /** Optional custom cell renderer */
    render?: (row: RowType) => React.ReactNode;
    /** Alignment for the cell content */
    align?: "left" | "center" | "right";
}

/**
 * Action button definition shown for each row.
 * - `icon` can be any MUI icon component.
 * - `onClick` receives the row data when button is pressed.
 * - `tooltip` optional tooltip text.
 */
export interface TableAction<RowType = any> {
    icon: React.ReactElement;
    onClick: (row: RowType) => void;
    tooltip?: string;
}

export interface TableProps<RowType = any> {
    /** Column definitions – order determines visual order */
    columns: TableColumn<RowType>[];
    /** Array of row data objects */
    rows: RowType[];
    /** Optional per‑row actions */
    actions?: TableAction<RowType>[];
    /** Message displayed when there are no rows */
    emptyMessage?: string;
    /** Optional MUI sx prop for custom styling */
    sx?: object;
}

/**
 * Generic, reusable table component built on top of MUI.
 *
 * Example usage:
 * ```tsx
 * const columns = [
 *   { id: "name", label: "Name" },
 *   { id: "age", label: "Age", align: "right" },
 * ];
 * const rows = [{ name: "Alice", age: 30 }, { name: "Bob", age: 25 }];
 * const actions = [
 *   { icon: <Edit />, tooltip: "Edit", onClick: r => console.log(r) },
 * ];
 * <Table columns={columns} rows={rows} actions={actions} />
 * ```
 */
const TableComponent = <RowType extends unknown>(props: TableProps<RowType>) => {
    const { columns, rows, actions, emptyMessage = "No data available", sx } = props;

    console.log(columns);
    console.table(rows)


    return (
        <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden", ...sx }}>
            <MuiTable size="small">
                <TableHead>
                    <TableRow>
                        {columns.map((col) => (
                            <TableCell key={String(col.id)} align={col.align ?? "left"} sx={{ fontWeight: 600 }}>
                                {col.label}
                            </TableCell>
                        ))}
                        {actions && actions.length > 0 && (
                            <TableCell align="center" sx={{ fontWeight: 600 }}>
                                Actions
                            </TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columns.length + (actions?.length ? 1 : 0)} align="center">
                                {emptyMessage}
                            </TableCell>
                        </TableRow>
                    ) : (
                        rows.map((row, rowIdx) => (
                            <TableRow key={rowIdx} hover>
                                {columns.map((col) => (
                                    <TableCell key={String(col.id)} align={col.align ?? "left"}>
                                        {col.render ? col.render(row) : (row as any)[col.id]}
                                    </TableCell>
                                ))}
                                {actions && actions.length > 0 && (
                                    <TableCell align="center">
                                        {actions.map((action, actIdx) => (
                                            <Tooltip key={actIdx} title={action.tooltip ?? ""} arrow>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => action.onClick(row)}
                                                    sx={{ marginX: 0.5 }}
                                                    aria-label={action.tooltip ?? `action-${actIdx}`}
                                                >
                                                    {action.icon}
                                                </IconButton>
                                            </Tooltip>
                                        ))}
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </MuiTable>
        </TableContainer>
    );
};

export default TableComponent;
