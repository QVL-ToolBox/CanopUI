import Box from "@mui/material/Box";
import { squircleSurface } from "../../squircle";
import MuiCheckbox from "@mui/material/Checkbox";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useRef, useState, type ReactNode } from "react";
import { useTranslation } from "../../i18n";
import { tokens, type CanopBreakpoint } from "../../tokens";
import { EditButton } from "../EditButton";
import { Spinner } from "../Spinner";
import { AnimatedRow } from "./AnimatedRow";
import { scrollbarSx } from "../../scrollbar";
import { columnValue, type CanopColumn } from "./tableColumn";
import { useKeyboardNav } from "./useKeyboardNav";
import { useRowDragDrop } from "./useRowDragDrop";
import { useRowSelection } from "./useRowSelection";
import { useStickyHeaderHeight } from "./useStickyHeaderHeight";
import { useTableSort } from "./useTableSort";

export type { CanopColumn, CanopSortDirection } from "./tableColumn";

export interface CanopDataTableProps<T> {
  columns: CanopColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  loading?: boolean;
  /** Contenu affiché quand rows est vide ; par défaut la traduction canop.dataTable.empty. */
  emptyMessage?: ReactNode;
  actions?: (row: T) => ReactNode;
  actionsHeader?: ReactNode;
  actionsWidth?: string | number;
  /**
   * Ajoute une action d'edition en fin de ligne, apres les actions du portail.
   * Le tableau se charge du bouton, de son nom accessible et de sa place ; ce
   * que l'edition declenche reste au portail, via `onRowEdit`.
   */
  editable?: boolean;
  /** Appele au clic sur l'action d'edition. */
  onRowEdit?: (row: T) => void;
  /** Rend l'action d'edition inactive sur certaines lignes. */
  canEditRow?: (row: T) => boolean;
  /** Nom accessible de l'action d'edition ; par defaut `canop.dataTable.edit`. */
  editLabel?: string;
  fixedLayout?: boolean;
  rowSx?: (row: T) => Record<string, unknown>;
  /** En-têtes figées en haut au scroll (sticky). */
  stickyHeader?: boolean;
  fillHeight?: boolean;
  maxHeight?: string | number;
  /** Rend la ligne déplaçable (glisser-déposer). */
  draggableRow?: (row: T) => boolean;
  /** Indique si la ligne peut recevoir un élément déposé. */
  canDropRow?: (row: T) => boolean;
  /** Appelé au dépôt : (ligne cible, clé de la ligne déposée). */
  onRowDrop?: (target: T, draggedKey: string) => void;
  /** Appelé au double-clic sur une ligne. */
  onRowDoubleClick?: (row: T) => void;
  /** Active la sélection : colonne de cases à cocher, clic, Ctrl/Maj+clic, cadre. */
  selectable?: boolean;
  /** Clés sélectionnées (sélection contrôlée). */
  selectedKeys?: string[];
  /** Appelé quand la sélection change. */
  onSelectionChange?: (keys: string[]) => void;
  /** Appelé au clic droit sur une ligne (menu contextuel). */
  onRowContextMenu?: (row: T, event: React.MouseEvent) => void;
  /** Anime l'apparition des lignes quand elles entrent dans le viewport. */
  animated?: boolean;
  /** Active la navigation clavier (flèches haut/bas, Entrée) avec scroll auto. */
  enableKeyboardNav?: boolean;
  /** Affiche la scrollbar du conteneur scrollable (masquée si false). */
  displayScrollbar?: boolean;
  /** Appelé à l'activation d'une ligne au clavier (Entrée). */
  onRowActivate?: (row: T) => void;
  /** Breakpoint sous lequel les colonnes hideOnMobile sont masquées. */
  mobileBreakpoint?: CanopBreakpoint;
}

const rowSurfaceDropShadowFollowingSquircle = "var(--canop-drop-shadow-e1)";
const rowSurfaceRadius = "1.5rem";
const rowSurfaceGeometry = { exponent: 4 };
const rowSurfaceLayerSelector = "& > td:first-of-type";
const rowGap = "0.875rem";
const scrollShadowGutter = tokens.spacing.md;
const selectionColumnWidth = "3rem";
const marqueeFill = "color-mix(in srgb, var(--canop-palette-primary-main) 12%, transparent)";
const focusOutline = "0.125rem solid var(--canop-palette-primary-main)";
const dragOverFill =
  "color-mix(in srgb, var(--canop-palette-primary-main) 22%, var(--canop-palette-background-paper))";

export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  loading = false,
  emptyMessage,
  actions,
  actionsHeader = "",
  actionsWidth,
  editable = false,
  onRowEdit,
  canEditRow,
  editLabel,
  fixedLayout = false,
  rowSx,
  stickyHeader = false,
  fillHeight = false,
  maxHeight,
  draggableRow,
  canDropRow,
  onRowDrop,
  onRowDoubleClick,
  selectable = false,
  selectedKeys,
  onSelectionChange,
  onRowContextMenu,
  animated = false,
  enableKeyboardNav = false,
  displayScrollbar = true,
  onRowActivate,
  mobileBreakpoint = "md",
}: CanopDataTableProps<T>) {
  const { t } = useTranslation();
  const hasInternalScroll = fillHeight || maxHeight != null;
  const isCompact = useMediaQuery((theme) => theme.breakpoints.down(mobileBreakpoint));
  const animatedKeys = useRef<Set<string>>(new Set());

  const [scrollEl, setScrollEl] = useState<HTMLElement | null>(null);
  const { headerRef, headerHeight } = useStickyHeaderHeight(stickyHeader);
  const { sortedRows, toggleSort, sortDirectionOf, ariaSortOf } = useTableSort<T>({
    columns,
    rows,
  });
  const { selectedIndex, setSelectedIndex, onKeyDown, tabIndex } = useKeyboardNav<T>({
    enabled: enableKeyboardNav,
    rows: sortedRows,
    getRowKey,
    scrollEl,
    onActivate: onRowActivate ?? onRowDoubleClick,
  });
  const { rowDragState } = useRowDragDrop<T>({ draggableRow, canDropRow, onRowDrop });
  const {
    bodyRef,
    selectedRowKeys,
    isSelectionColumnVisible,
    areAllRowsSelected,
    areSomeRowsSelected,
    marqueeRect,
    toggleAllRows,
    toggleRowSelection,
    handleMarqueeMouseDown,
    handleRowClick,
    handleRowDoubleClick,
    handleRowKeyDown,
    handleRowFocus,
    rowTabIndex,
  } = useRowSelection<T>({
    selectable,
    rows: sortedRows,
    getRowKey,
    selectedKeys,
    onSelectionChange,
    onRowDoubleClick,
    onRowActivate,
    onRowFocus: setSelectedIndex,
  });

  const visibleColumns = isCompact ? columns.filter((column) => !column.hideOnMobile) : columns;
  const hasActionsColumn = Boolean(actions) || editable;
  const colSpan =
    visibleColumns.length + (hasActionsColumn ? 1 : 0) + (isSelectionColumnVisible ? 1 : 0);

  const stickyHeaderCellSx = stickyHeader
    ? { position: "sticky" as const, top: 0, zIndex: 2, backgroundColor: "transparent" }
    : {};

  const singleLayerRowSurfaceSx = {
    ...squircleSurface({
      radius: rowSurfaceRadius,
      background: "var(--canop-palette-background-paper)",
      shadow: rowSurfaceDropShadowFollowingSquircle,
      layerSelector: rowSurfaceLayerSelector,
      ...rowSurfaceGeometry,
    }),
    "& td": { backgroundColor: "transparent", borderBottom: "none" },
  };

  const containerScrollbarSx = displayScrollbar ? scrollbarSx() : scrollbarSx("hidden");

  return (
    <Box
      sx={{
        position: "relative",
        ...(fillHeight ? { display: "flex", flexDirection: "column", flex: 1, minHeight: 0 } : {}),
      }}
    >
      <TableContainer
        ref={hasInternalScroll ? setScrollEl : undefined}
        onMouseDown={selectable ? handleMarqueeMouseDown : undefined}
        onKeyDown={enableKeyboardNav ? onKeyDown : undefined}
        tabIndex={tabIndex}
        sx={
          fillHeight
            ? {
                flex: 1,
                minHeight: 0,
                overflow: "auto",
                paddingX: scrollShadowGutter,
                marginX: `-${scrollShadowGutter}`,
                ...containerScrollbarSx,
              }
            : maxHeight != null
              ? {
                  maxHeight,
                  overflow: "auto",
                  paddingX: scrollShadowGutter,
                  marginX: `-${scrollShadowGutter}`,
                  ...containerScrollbarSx,
                }
              : { overflow: "visible" }
        }
      >
        {stickyHeader && headerHeight > 0 ? (
          <Box
            aria-hidden
            data-canop-sticky-surface=""
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              height: `${headerHeight}px`,
              marginBottom: `-${headerHeight}px`,
              backgroundColor: "background.paper",
            }}
          />
        ) : null}
        <Table
          sx={{
            borderCollapse: "separate",
            borderSpacing: `0 ${rowGap}`,
            ...(fixedLayout ? { tableLayout: "fixed" } : {}),
          }}
        >
          <TableHead ref={headerRef}>
            <TableRow>
              {isSelectionColumnVisible ? (
                <TableCell
                  padding="checkbox"
                  sx={{
                    borderBottom: "none",
                    width: selectionColumnWidth,
                    ...stickyHeaderCellSx,
                  }}
                >
                  <MuiCheckbox
                    color="primary"
                    checked={areAllRowsSelected}
                    indeterminate={areSomeRowsSelected}
                    onChange={toggleAllRows}
                    slotProps={{ input: { "aria-label": t("canop.dataTable.selectAll") } }}
                  />
                </TableCell>
              ) : null}
              {visibleColumns.map((column) => {
                const sortDirection = sortDirectionOf(column.key);
                return (
                  <TableCell
                    key={column.key}
                    align={column.align ?? "left"}
                    sortDirection={sortDirection}
                    aria-sort={ariaSortOf(column)}
                    sx={{
                      borderBottom: "none",
                      color: "text.secondary",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      ...stickyHeaderCellSx,
                      ...(column.width != null ? { width: column.width } : {}),
                    }}
                  >
                    {column.sortable ? (
                      <TableSortLabel
                        active={sortDirection !== false}
                        direction={sortDirection || "asc"}
                        onClick={() => toggleSort(column.key)}
                      >
                        {column.header}
                      </TableSortLabel>
                    ) : (
                      column.header
                    )}
                  </TableCell>
                );
              })}
              {hasActionsColumn ? (
                <TableCell
                  align="center"
                  sx={{
                    borderBottom: "none",
                    ...stickyHeaderCellSx,
                    ...(actionsWidth != null ? { width: actionsWidth } : {}),
                  }}
                >
                  {actionsHeader}
                </TableCell>
              ) : null}
            </TableRow>
          </TableHead>
          <TableBody ref={bodyRef}>
            {loading ? (
              <TableRow>
                <TableCell colSpan={colSpan} align="center" sx={{ borderBottom: "none" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      paddingY: tokens.spacing.lg,
                    }}
                  >
                    <Spinner />
                  </Box>
                </TableCell>
              </TableRow>
            ) : sortedRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colSpan} align="center" sx={{ borderBottom: "none" }}>
                  {emptyMessage ?? t("canop.dataTable.empty")}
                </TableCell>
              </TableRow>
            ) : (
              sortedRows.map((row, index) => {
                const key = getRowKey(row);
                const { isDraggable, isDragOver, handlers } = rowDragState(row, key);
                const isSelected = selectedRowKeys.has(key);
                const isKeyboardFocused = enableKeyboardNav && selectedIndex === index;
                return (
                  <AnimatedRow
                    key={key}
                    animate={animated}
                    scrollRoot={scrollEl}
                    index={index}
                    alreadyAnimated={animatedKeys.current.has(key)}
                    onAnimated={() => animatedKeys.current.add(key)}
                    data-rowkey={key}
                    selected={isSelected}
                    aria-selected={selectable ? isSelected : undefined}
                    tabIndex={rowTabIndex(index)}
                    draggable={isDraggable}
                    {...handlers}
                    onClick={selectable ? (event) => handleRowClick(event, index) : undefined}
                    onFocus={selectable ? () => handleRowFocus(index) : undefined}
                    onKeyDown={selectable ? (event) => handleRowKeyDown(event, index) : undefined}
                    onContextMenu={
                      onRowContextMenu
                        ? (event) => {
                            event.preventDefault();
                            onRowContextMenu(row, event);
                          }
                        : undefined
                    }
                    onDoubleClick={
                      handleRowDoubleClick ? () => handleRowDoubleClick(row) : undefined
                    }
                    sx={{
                      ...singleLayerRowSurfaceSx,
                      ...(rowSx ? rowSx(row) : {}),
                      ...(onRowDoubleClick || selectable ? { userSelect: "none" } : {}),
                      ...(isDraggable || onRowDoubleClick || selectable
                        ? { cursor: "pointer" }
                        : {}),
                      ...(selectable
                        ? {
                            "&:focus-visible": {
                              outline: focusOutline,
                              outlineOffset: "-0.125rem",
                            },
                          }
                        : {}),
                      ...(isSelected ? { "& td": { backgroundColor: "action.selected" } } : {}),
                      ...(isKeyboardFocused && !isSelected
                        ? { "& td": { backgroundColor: "action.hover" } }
                        : {}),
                      ...(isDragOver ? { "& td": { backgroundColor: dragOverFill } } : {}),
                    }}
                  >
                    {isSelectionColumnVisible ? (
                      <TableCell padding="checkbox">
                        <MuiCheckbox
                          color="primary"
                          checked={isSelected}
                          onClick={(event) => event.stopPropagation()}
                          onChange={() => toggleRowSelection(key)}
                          slotProps={{ input: { "aria-label": t("canop.dataTable.selectRow") } }}
                        />
                      </TableCell>
                    ) : null}
                    {visibleColumns.map((column) => (
                      <TableCell key={column.key} align={column.align ?? "left"}>
                        {column.render
                          ? column.render(row)
                          : (columnValue(row, column) as ReactNode)}
                      </TableCell>
                    ))}
                    {hasActionsColumn ? (
                      <TableCell align="right">
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            gap: tokens.spacing["2xs"],
                          }}
                        >
                          {actions?.(row)}
                          {editable ? (
                            <EditButton
                              ariaLabel={editLabel ?? t("canop.dataTable.edit")}
                              disabled={canEditRow ? !canEditRow(row) : false}
                              onClick={() => onRowEdit?.(row)}
                            />
                          ) : null}
                        </Box>
                      </TableCell>
                    ) : null}
                  </AnimatedRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {marqueeRect ? (
        <Box
          sx={{
            position: "fixed",
            left: marqueeRect.left,
            top: marqueeRect.top,
            width: marqueeRect.width,
            height: marqueeRect.height,
            border: "0.0625rem solid",
            borderColor: "primary.main",
            backgroundColor: marqueeFill,
            zIndex: 1400,
            pointerEvents: "none",
          }}
        />
      ) : null}
    </Box>
  );
}
