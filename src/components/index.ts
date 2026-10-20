export type { CanopPaletteColorName } from "./_shared/paletteColorVar";
export { AddButton, type CanopAddButtonProps } from "./AddButton";
export { ApproveButton, type CanopApproveButtonProps } from "./ApproveButton";
export {
  Avatar,
  type CanopAvatarProps,
  type CanopAvatarSize,
  type CanopAvatarTone,
} from "./Avatar";
export {
  BentoGrid,
  BentoTile,
  type CanopBentoColumns,
  type CanopBentoGridProps,
  type CanopBentoSpan,
  type CanopBentoTileProps,
} from "./BentoGrid";
export {
  Button,
  type CanopButtonProps,
  type CanopButtonSize,
  type CanopButtonVariant,
} from "./Button";
export {
  Card,
  type CanopCardDensity,
  type CanopCardElevation,
  type CanopCardFlash,
  type CanopCardProps,
  type CanopCardRadius,
  type CanopCardTone,
  type CanopCardVariant,
} from "./Card";
export {
  CardGrid,
  type CanopCardGridProps,
  type CanopCardGridGap,
  type CanopCardGridColumns,
} from "./CardGrid";
export { Choice, type CanopChoiceProps, type CanopChoiceState } from "./Choice";
export {
  Autocomplete,
  foldForSearch,
  type CanopAutocompleteProps,
  type CanopAutocompleteOption,
} from "./Autocomplete";
export {
  Carousel,
  useCarousel,
  CAROUSEL_DEFAULT_INTERVAL,
  type CanopCarouselProps,
  type CanopCarouselNavigation,
  type CanopCarouselOrientation,
  type CanopCarouselTransition,
  type UseCarouselOptions,
  type UseCarouselResult,
} from "./Carousel";
export { ConfirmDialog, type CanopConfirmDialogProps } from "./ConfirmDialog";
export {
  SaveButton,
  type CanopSaveButtonProps,
  useSaveButton,
  type CanopSaveState,
  type UseSaveButtonResult,
} from "./SaveButton";
export {
  CookieBanner,
  type CanopCookieBannerProps,
  useCookieConsent,
  type CanopCookieConsentState,
  DEFAULT_COOKIE_CONSENT_KEY,
  getStoredConsent,
  type CanopCookieConsent,
} from "./CookieBanner";
export {
  CommandPalette,
  type CanopCommandPaletteProps,
  type CanopCommandItem,
  useCommandPalette,
  type UseCommandPaletteResult,
} from "./CommandPalette";
export { DeleteButton, type CanopDeleteButtonProps } from "./DeleteButton";
export { EditButton, type CanopEditButtonProps } from "./EditButton";
export {
  DataTable,
  type CanopColumn,
  type CanopDataTableProps,
  type CanopSortDirection,
  useInView,
  type UseInViewOptions,
  type UseInViewResult,
} from "./DataTable";
export {
  MultiSelect,
  type CanopMultiSelectOption,
  type CanopMultiSelectProps,
} from "./MultiSelect";
export { Select, type CanopSelectOption, type CanopSelectProps } from "./Select";
export { StatusChip, type CanopStatusChipProps, type CanopStatusTone } from "./StatusChip";
export {
  Text,
  type CanopTextAlign,
  type CanopTextProps,
  type CanopTextTone,
  type CanopTextVariant,
  type CanopTextWeight,
} from "./Text";
export {
  Legend,
  type CanopLegendProps,
  type CanopLegendEntry,
  type CanopLegendTone,
} from "./Legend";
export {
  DescriptionList,
  type CanopDescriptionItem,
  type CanopDescriptionListProps,
} from "./DescriptionList";
export { Feedback, type CanopFeedbackProps, type CanopFeedbackSeverity } from "./Feedback";
export { Form, type CanopFormProps, useForm, type UseFormParams, type UseFormResult } from "./Form";
export {
  Heading,
  type CanopHeadingAlign,
  type CanopHeadingLevel,
  type CanopHeadingProps,
  type CanopHeadingSize,
  type CanopResponsiveHeadingSize,
} from "./Heading";
export type { CanopHeadingTextElement } from "./Heading";
export {
  Divider,
  type CanopDividerProps,
  type CanopDividerOrientation,
  type CanopDividerSpacing,
} from "./Divider";
export {
  Icon,
  icons,
  type CanopIconName,
  type CanopIconProps,
  type CanopIconVariant,
  type CanopIconSize,
  type CanopIconColor,
} from "./Icon";
export {
  IconActionButton,
  type CanopIconActionButtonProps,
  type CanopIconActionButtonVariant,
} from "./IconActionButton";
export { InlineInput, type CanopInlineInputProps } from "./InlineInput";
export {
  Pressable,
  type CanopPressableProps,
  type CanopPressableRadius,
  type CanopPressableRole,
  type CanopPressableSpacing,
} from "./Pressable";
export {
  Input,
  type CanopInputProps,
  type CanopInputSize,
  type CanopInputType,
  InputText,
  type CanopInputTextProps,
  InputEmail,
  type CanopInputEmailProps,
  InputPassword,
  type CanopInputPasswordProps,
  PasswordStrength,
  type CanopPasswordStrengthProps,
} from "./Input";
export { LegalLinks, LEGAL_NOTICE_ANCHOR, type CanopLegalLinksProps } from "./LegalLinks";
export { LanguageSelector, type CanopLanguageSelectorProps } from "./LanguageSelector";
export { Layout, type CanopLayoutProps } from "./Layout";
export { Link, type CanopLinkProps, type CanopLinkSize, type CanopLinkColor } from "./Link";
export {
  LiveRegion,
  type CanopLiveRegionPoliteness,
  type CanopLiveRegionProps,
  useLiveAnnouncer,
  type UseLiveAnnouncerResult,
} from "./LiveRegion";
export {
  PageContent,
  type CanopPageContentProps,
  type CanopPageContentMaxWidth,
} from "./PageContent";
export {
  PageScaffold,
  type CanopPageScaffoldProps,
  type CanopPageBackground,
  type CanopActionsPlacement,
} from "./PageScaffold";
export {
  Spinner,
  type CanopSpinnerProps,
  type CanopSpinnerSize,
  type CanopSpinnerColor,
} from "./Spinner";
export {
  Stack,
  type CanopStackElement,
  type CanopStackGap,
  type CanopStackProps,
  type CanopStackDirection,
  type CanopStackAlign,
  type CanopStackJustify,
  type CanopStackPadding,
  type CanopStackRole,
} from "./Stack";
export {
  Menu,
  type CanopMenuProps,
  type CanopMenuPosition,
  type CanopMenuItemModel,
  MenuItem,
  type CanopMenuItemProps,
  useMenuAnchor,
  type UseMenuAnchorResult,
} from "./Menu";
export {
  Navbar,
  type CanopMobileFooterPlacement,
  type CanopNavbarItem,
  type CanopNavbarProps,
} from "./Navbar";
export type { CanopNavbarTitleLevel } from "./Navbar";
export {
  ProgressBar,
  type CanopProgressBarProps,
  type CanopProgressBarSingleProps,
  type CanopProgressBarSegmentedProps,
  type CanopProgressBarColor,
  type CanopProgressSegment,
} from "./ProgressBar";
export { Rating, type CanopRatingProps, type CanopRatingColor } from "./Rating";
export {
  Slider,
  type CanopSliderProps,
  type CanopSliderColor,
  type CanopSliderSize,
} from "./Slider";
export {
  SegmentedControl,
  type CanopSegmentedControlProps,
  type CanopSegmentedControlOption,
  type CanopSegmentedControlSize,
} from "./SegmentedControl";
export {
  Badge,
  type CanopBadgeProps,
  type CanopBadgeColor,
  type CanopBadgePlacement,
  type CanopBadgeVariant,
} from "./Badge";
export { StatCard, type CanopStatCardProps } from "./StatCard";
export { SlidingIndicator, type CanopSlidingIndicatorProps } from "./SlidingIndicator";
export { Separator, type CanopSeparatorProps, type CanopSeparatorVariant } from "./Separator";
export { SettingsMenu, type CanopSettingsMenuProps } from "./SettingsMenu";
export {
  Skeleton,
  type CanopSkeletonBlockProps,
  type CanopSkeletonLinesProps,
  type CanopSkeletonProps,
  type CanopSkeletonVariant,
} from "./Skeleton";
export {
  ThemeToggle,
  useThemeToggle,
  type UseThemeToggleResult,
  type CanopThemeToggleOptionModel,
} from "./ThemeToggle";
export {
  SoundToggle,
  useSoundToggle,
  type CanopSoundToggleProps,
  type UseSoundToggleResult,
} from "./SoundToggle";
export { Lives, type CanopLivesProps } from "./Lives";
export { Streak, type CanopStreakProps } from "./Streak";
export { ShareResult, type CanopShareResultProps, type CanopShareTone } from "./ShareResult";
export { Countdown, type CanopCountdownProps } from "./Countdown";
export {
  SvgMap,
  SvgMapControls,
  useSvgMapGestures,
  type CanopSvgMapProps,
  type CanopSvgMapRegion,
  type CanopSvgMapControlsProps,
  type UseSvgMapGesturesOptions,
  type UseSvgMapGesturesResult,
} from "./SvgMap";
export { Toggle, type CanopToggleProps, type CanopToggleColor } from "./Toggle";
export { Toast, type CanopToastProps, type CanopToastSeverity } from "./Toast";
export {
  VisuallyHidden,
  type CanopVisuallyHiddenElement,
  type CanopVisuallyHiddenProps,
} from "./VisuallyHidden";
export type { CanopToastAction } from "./Toast";
export { SidePanel, type CanopSidePanelProps } from "./SidePanel";
export {
  ShapeBackground,
  type CanopShapeBackgroundProps,
  type CanopShapeVariant,
} from "./ShapeBackground";
export {
  HalloweenDecor,
  type CanopHalloweenDecorDensity,
  type CanopHalloweenDecorProps,
  type CanopHalloweenDecorScope,
} from "./HalloweenDecor";
export {
  CanopyBackground,
  CANOP_CANOPY_SCENES,
  CANOPY_ASSET_BASE,
  CANOPY_LOOP_SECONDS,
  canopyScenesFrom,
  resolveCanopyScene,
  type CanopCanopyBackgroundProps,
  type CanopCanopyScene,
  type CanopCanopySceneMode,
  type CanopCanopySceneOverride,
} from "./CanopyBackground";
export { Checkbox, type CanopCheckboxProps } from "./Checkbox";
export { BulletList, type CanopBulletListItem, type CanopBulletListProps } from "./BulletList";
export {
  Donut,
  type CanopDonutProps,
  useDonut,
  type CanopDonutColor,
  type CanopDonutSegment,
  type CanopDonutThickness,
  type CanopDonutGeometry,
  type UseDonutResult,
} from "./Donut";
export { EmptyState, type CanopEmptyStateProps, type CanopEmptyStateSurface } from "./EmptyState";
export {
  Toolbar,
  type CanopToolbarProps,
  useToolbar,
  type UseToolbarParams,
  type UseToolbarResult,
  type CanopToolbarView,
  type CanopToolbarAction,
  type CanopToolbarSortOption,
  type CanopToolbarSearchConfig,
  type CanopToolbarSortConfig,
  type CanopToolbarViewConfig,
} from "./Toolbar";
export {
  SelectionBar,
  type CanopSelectionBarProps,
  type CanopSelectionAction,
  useSelectionBar,
  type UseSelectionBarParams,
  type UseSelectionBarResult,
} from "./SelectionBar";
export {
  Breadcrumb,
  type CanopBreadcrumbProps,
  type CanopBreadcrumbItem,
  type CanopBreadcrumbSegment,
  useBreadcrumb,
  type UseBreadcrumbParams,
  type UseBreadcrumbResult,
} from "./Breadcrumb";
export { FileCard, type CanopFileCardProps, type CanopFileCardKind } from "./FileCard";
export { Dropzone, type CanopDropzoneProps } from "./Dropzone";
export { Lightbox, type CanopLightboxProps, type CanopLightboxItem } from "./Lightbox";
