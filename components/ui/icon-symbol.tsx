// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * SF Symbols to Material Icons mappings for 멍냥 app
 */
const MAPPING = {
  // Navigation
  "house.fill":                               "home",
  "map.fill":                                 "map",
  "bubble.left.and.bubble.right.fill":        "forum",
  "person.fill":                              "person",
  // Common
  "paperplane.fill":                          "send",
  "chevron.left.forwardslash.chevron.right":  "code",
  "chevron.right":                            "chevron-right",
  "chevron.left":                             "chevron-left",
  "chevron.down":                             "expand-more",
  "xmark":                                    "close",
  "xmark.circle.fill":                        "cancel",
  "magnifyingglass":                          "search",
  "bell.fill":                                "notifications",
  "bell":                                     "notifications-none",
  "heart.fill":                               "favorite",
  "heart":                                    "favorite-border",
  "star.fill":                                "star",
  "star":                                     "star-border",
  "star.leadinghalf.filled":                  "star-half",
  "location.fill":                            "location-on",
  "location":                                 "location-on",
  "phone.fill":                               "phone",
  "clock":                                    "access-time",
  "clock.fill":                               "access-time-filled",
  "camera.fill":                              "camera-alt",
  "photo":                                    "photo",
  "photo.fill":                               "photo",
  "plus":                                     "add",
  "plus.circle.fill":                         "add-circle",
  "minus":                                    "remove",
  "pencil":                                   "edit",
  "trash.fill":                               "delete",
  "square.and.arrow.up":                      "share",
  "arrow.left":                               "arrow-back",
  "arrow.right":                              "arrow-forward",
  "arrow.up":                                 "arrow-upward",
  "arrow.down":                               "arrow-downward",
  "checkmark":                                "check",
  "checkmark.circle.fill":                    "check-circle",
  "info.circle":                              "info",
  "exclamationmark.triangle.fill":            "warning",
  "car.fill":                                 "directions-car",
  "figure.walk":                              "directions-walk",
  "pawprint.fill":                            "pets",
  "pawprint":                                 "pets",
  "fork.knife":                               "restaurant",
  "cup.and.saucer.fill":                      "local-cafe",
  "cross.fill":                               "local-hospital",
  "scissors":                                 "content-cut",
  "building.2.fill":                          "business",
  "tree.fill":                                "park",
  "storefront.fill":                          "store",
  "bed.double.fill":                          "hotel",
  "list.bullet":                              "list",
  "slider.horizontal.3":                      "tune",
  "line.3.horizontal.decrease.circle":        "filter-list",
  "ellipsis":                                 "more-horiz",
  "ellipsis.circle":                          "more-horiz",
  "person.2.fill":                            "group",
  "person.crop.circle":                       "account-circle",
  "gearshape.fill":                           "settings",
  "rectangle.portrait.and.arrow.right":       "logout",
  "eye.fill":                                 "visibility",
  "hand.thumbsup.fill":                       "thumb-up",
  "tag.fill":                                 "local-offer",
  "calendar":                                 "calendar-today",
  "doc.text.fill":                            "description",
  "bubble.left.fill":                         "chat-bubble",
  "arrow.clockwise":                          "refresh",
  "wifi.slash":                               "wifi-off",
  "map.circle.fill":                          "map",
  "scope":                                    "my-location",
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
