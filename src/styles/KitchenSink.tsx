import { LabelPrimitive, List, Button as ExpoButton, Picker } from '@expo/ui/swift-ui';
import { EvilIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useState } from "react";
import { ScrollView, TextStyle, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar, AvatarGroup } from "../components/Avatar";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Body, BodyLarge, BodySmall, Caption, H1, H2, H3, Label } from "../components/Typography";
import { theme } from "../styles/theme";
import ListComponent from '../components/List';
import { useHeaderHeight } from '@react-navigation/elements';

export default function App() {
  const [count, setCount] = useState(0);
  const [loadingButton, setLoadingButton] = useState<string | null>(null);

  const handleButtonPress = (buttonType: string) => {
    setLoadingButton(buttonType);
    setTimeout(() => {
      setLoadingButton(null);
    }, 2000);
  };

  const insets = useSafeAreaInsets();
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
      <ScrollView
      contentInsetAdjustmentBehavior="automatic"
        style={{
          backgroundColor: theme.colors.background,
          flex: 1,
          marginBottom: insets.bottom,
        }}
        contentContainerStyle={{
          backgroundColor: theme.colors.background,
          padding: 10,
          paddingBottom: 40,
        }}
      >
          {/* Header */}
          {/* <View style={{ marginBottom: 48, alignItems: 'center' } as ViewStyle}>
            <H1 style={{ marginBottom: 16, textAlign: 'center' } as TextStyle}>Vibecode Design System</H1>
            <BodyLarge style={{ textAlign: 'center', color: theme.colors.textSecondary, marginBottom: 24 } as TextStyle}>
              A comprehensive component library
            </BodyLarge>
            <Badge variant="primary" size="md">
              Kitchen Sink Demo
            </Badge>
          </View> */}

          {/* Picker Section */}
          <Card style={{ marginBottom: 32 }}>
          <View style={{ marginBottom: 24 }}>
            <H3 style={{ marginBottom: 24, color: theme.colors.primary } as TextStyle}>Picker</H3>
            <Label style={{ marginBottom: 16 } as TextStyle}>Price Range</Label>
            <Picker options={['first option', 'second option', 'third option']}
              selectedIndex={selectedIndex} 
              onOptionSelected={({ nativeEvent: { index } }) => {
                setSelectedIndex(index);
              }}
              variant="segmented"
            />
          </View>
          </Card>

          {/* Lists Section */}
            <H3 style={{ marginBottom: 24, color: theme.colors.primary } as TextStyle}>Lists</H3>
            {/* <View style={{ marginBottom: 24 }}>
              <Label style={{ marginBottom: 16 } as TextStyle}>Interactive List</Label> */}

              <ListComponent />
              <View style={{ marginBottom: 24 }}></View>
              
            {/* </View> */}

          {/* Typography Section */}
          <Card style={{ marginBottom: 32 }}>
            <H3 style={{ marginBottom: 24, color: theme.colors.primary } as TextStyle}>Typography</H3>
            <View style={{ gap: 16 } as ViewStyle}>
              <H1>Heading 1 - Hero Title</H1>
              <H2>Heading 2 - Section Title</H2>
              <H3>Heading 3 - Subsection</H3>
              <BodyLarge>Body Large - Perfect for introductions and important content that needs emphasis.</BodyLarge>
              <Body>Body - The standard text for most content, readable and comfortable.</Body>
              <BodySmall>Body Small - Secondary information and supporting text.</BodySmall>
              <Label>Label - Form labels and UI elements</Label>
              <Caption>Caption - Metadata, timestamps, and fine print</Caption>
            </View>
          </Card>

          {/* Buttons Section */}
          <Card style={{ marginBottom: 32 }}>
            <H3 style={{ marginBottom: 24, color: theme.colors.primary } as TextStyle}>Buttons</H3>

            {/* Button Variants */}
            <View style={{ marginBottom: 24 }}>
              <Label style={{ marginBottom: 16 } as TextStyle}>Variants (Non-Full Width with Loading)</Label>
              <View style={{ gap: 16, alignItems: 'flex-start' } as ViewStyle}>
                <Button
                  title="Primary Button"
                  variant="primary"
                  onPress={() => handleButtonPress("primary")}
                  loading={loadingButton === "primary"}
                />
                <Button
                  title="Secondary Button"
                  variant="secondary"
                  onPress={() => handleButtonPress("secondary")}
                  loading={loadingButton === "secondary"}
                />
                <Button
                  title="Outline Button"
                  variant="outline"
                  onPress={() => handleButtonPress("outline")}
                  loading={loadingButton === "outline"}
                />
                <Button 
                  title="Ghost Button" 
                  variant="ghost" 
                  onPress={() => handleButtonPress("ghost")} 
                  loading={loadingButton === "ghost"}
                />
                <Button 
                  title="Danger Button" 
                  variant="danger" 
                  onPress={() => handleButtonPress("danger")} 
                  loading={loadingButton === "danger"}
                />
              </View>
            </View>

            <View style={{ marginBottom: 24 }}>
              <Label style={{ marginBottom: 16 } as TextStyle}>Full Width Variants</Label>
              <View style={{ gap: 16 } as ViewStyle}>
                <Button
                  fullWidth
                  title="Primary Button"
                  variant="primary"
                  onPress={() => handleButtonPress("primary-full")}
                  loading={loadingButton === "primary-full"}
                />
                <Button
                  fullWidth
                  title="Secondary Button"
                  variant="secondary"
                  onPress={() => handleButtonPress("secondary-full")}
                  loading={loadingButton === "secondary-full"}
                />
                <Button
                  fullWidth
                  title="Outline Button"
                  variant="outline"
                  onPress={() => handleButtonPress("outline-full")}
                  loading={loadingButton === "outline-full"}
                />
                <Button fullWidth title="Ghost Button" variant="ghost" onPress={() => setCount(count * 2)} />
                <Button fullWidth title="Danger Button" variant="danger" onPress={() => setCount(0)} />
              </View>
            </View>

            {/* Button Sizes */}
            <View style={{ marginBottom: 24 }}>
              <Label style={{ marginBottom: 16 } as TextStyle}>Sizes with Loading</Label>
              <View style={{ gap: 16, alignItems: 'flex-start' } as ViewStyle}>
                <Button 
                  title="Small Button" 
                  variant="primary" 
                  size="sm" 
                  onPress={() => handleButtonPress("small")} 
                  loading={loadingButton === "small"}
                />
                <Button 
                  title="Medium Button" 
                  variant="primary" 
                  size="md" 
                  onPress={() => handleButtonPress("medium")} 
                  loading={loadingButton === "medium"}
                />
                <Button 
                  title="Medium Button Full Width" 
                  variant="primary" 
                  fullWidth
                  size="md" 
                  onPress={() => handleButtonPress("medium-full")} 
                  loading={loadingButton === "medium-full"}
                />

              </View>
            </View>

            {/* Button States */}
            <View style={{ marginBottom: 16 }}>
              <Label style={{ marginBottom: 16 } as TextStyle}>States</Label>
              <View style={{ gap: 16 } as ViewStyle}>
                <Button title="Disabled Button" variant="primary" disabled onPress={() => {}} />
                <Button title="Full Width" variant="secondary" fullWidth onPress={() => {}} />
              </View>
            </View>

            <Body style={{ marginTop: 24, textAlign: 'center' } as TextStyle}>
              Counter: <H3 style={{ color: theme.colors.primary } as TextStyle}>{count}</H3>
            </Body>
          </Card>

          {/* Cards Section */}
          <Card style={{ marginBottom: 32, backgroundColor: '#f2f2f2' }}>
            <H3 style={{ marginBottom: 24, color: theme.colors.primary } as TextStyle}>Cards</H3>
            <View style={{ gap: 24 } as ViewStyle}>
              <Card variant="default">
                <H3>Default Card</H3>
                <BodySmall>This is a default card with subtle shadows and clean borders.</BodySmall>
              </Card>

              <Card variant="elevated">
                <H3>Elevated Card</H3>
                <BodySmall>This elevated card has more prominent shadows for emphasis.</BodySmall>
              </Card>

              <Card variant="outlined" onPress={() => {}}>
                <H3>Interactive Outlined Card</H3>
                <BodySmall>This outlined card is interactive - tap to see the animation!</BodySmall>
              </Card>

              {/* Recovery Key Modal-Style Card */}
              <Card style={{ gap: 16, marginBottom: 32 }}>
            {/* Header with close button */}
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              } as ViewStyle}
            >
              <H2>Add Recovery Key </H2>
              <EvilIcons name="close" size={20} color="gray" />
            </View>

            {/* Recovery Key Image */}
            <View style={{ gap: 8 } as ViewStyle}>
              <Image
                source="https://i.imgur.com/EEWNXfK.jpeg"
                style={{
                  width: "100%",
                  height: 130,
                  borderRadius: 16,
                }}
                contentFit="cover"
              />

              {/* Description */}
              <BodySmall>Add a Recovery Key to enable multifactor authentication and advanced recovery.</BodySmall>
            </View>

            {/* Action buttons */}
            <View style={{ width: '100%', gap: 16, flexDirection: 'row' } as ViewStyle}>
              <View style={{ flex: 1 }}>
                <Button title="Do it later" variant="secondary" size="md" onPress={() => {}} fullWidth />
              </View>
              <View style={{ flex: 1 }}>
                <Button title="Continue" variant="primary" onPress={() => {}} fullWidth />
              </View>
            </View>
          </Card>
            </View>
          </Card>

          <Card style={{ gap: 16, marginBottom: 32 }}>
            {/* Header with close button */}
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              } as ViewStyle}
            >
              <H2>Add Recovery Key</H2>
              <EvilIcons name="close" size={20} color="gray" />
            </View>

            {/* Recovery Key Image */}
            <View style={{ gap: 8 } as ViewStyle}>
              <Image
                source="https://i.imgur.com/EEWNXfK.jpeg"
                style={{
                  width: "100%",
                  height: 130,
                  borderRadius: 16,
                }}
                contentFit="cover"
              />

              {/* Description */}
              <BodySmall>Add a Recovery Key to enable multifactor authentication and advanced recovery.</BodySmall>
            </View>

            {/* Action buttons */}
            <View style={{ width: '100%', gap: 16, flexDirection: 'row' } as ViewStyle}>
              <View style={{ flex: 1 }}>
                <Button title="Do it later" variant="secondary" size="md" onPress={() => {}} fullWidth />
              </View>
              <View style={{ flex: 1 }}>
                <Button title="Continue" variant="primary" onPress={() => {}} fullWidth />
              </View>
            </View>
          </Card>


          {/* Badges Section */}
          <Card style={{ marginBottom: 32 }}>
            <H3 style={{ marginBottom: 24, color: theme.colors.primary } as TextStyle}>Badges</H3>

            <View style={{ marginBottom: 24 }}>
              <Label style={{ marginBottom: 16 } as TextStyle}>Variants</Label>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 } as ViewStyle}>
                <Badge variant="primary">Primary</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Error</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="neutral">Neutral</Badge>
              </View>
            </View>

            <View style={{ marginBottom: 24 }}>
              <Label style={{ marginBottom: 16 } as TextStyle}>Sizes</Label>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 } as ViewStyle}>
                <Badge variant="primary" size="sm">
                  Small
                </Badge>
                <Badge variant="primary" size="md">
                  Medium
                </Badge>
                <Badge variant="primary" size="lg">
                  Large
                </Badge>
              </View>
            </View>

            <View style={{ marginBottom: 16 }}>
              <Label style={{ marginBottom: 16 } as TextStyle}>Dots</Label>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 } as ViewStyle}>
                <Badge variant="primary" dot size="sm" />
                <Badge variant="success" dot size="md" />
                <Badge variant="error" dot size="lg" />
              </View>
            </View>
          </Card>

          {/* Avatars Section */}
          <Card style={{ marginBottom: 32 }}>
            <H3 style={{ marginBottom: 24, color: theme.colors.primary } as TextStyle}>Avatars</H3>

            <View style={{ marginBottom: 24 }}>
              <Label style={{ marginBottom: 16 } as TextStyle}>Individual Avatars</Label>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 } as ViewStyle}>
                <Avatar name="John Doe" size="xs" />
                <Avatar name="Jane Smith" size="sm" />
                <Avatar name="Bob Wilson" size="md" />
                <Avatar name="Alice Johnson" size="lg" />
                <Avatar name="Mike Brown" size="xl" />
                <Avatar name="Sarah Davis" size="2xl" />
              </View>
            </View>

            <View style={{ marginBottom: 24 }}>
              <Label style={{ marginBottom: 16 } as TextStyle}>With Badges</Label>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 } as ViewStyle}>
                <Avatar name="Online User" size="lg" badge={<Badge variant="success" dot size="sm" />} />
                <Avatar name="Busy User" size="lg" badge={<Badge variant="warning" dot size="sm" />} />
                <Avatar name="Offline User" size="lg" badge={<Badge variant="neutral" dot size="sm" />} />
              </View>
            </View>

            <View style={{ marginBottom: 16 }}>
              <Label style={{ marginBottom: 16 } as TextStyle}>Avatar Group</Label>
              <AvatarGroup max={4} size="md">
                <Avatar name="Alice Johnson" />
                <Avatar name="Bob Smith" />
                <Avatar name="Carol White" />
                <Avatar name="David Brown" />
                <Avatar name="Eve Davis" />
                <Avatar name="Frank Wilson" />
                <Avatar name="Grace Miller" />
              </AvatarGroup>
            </View>
          </Card>

          {/* Color Palette */}
          <Card>
            <H3 style={{ marginBottom: 24, color: theme.colors.primary } as TextStyle}>Color Palette</H3>

            <View style={{ marginBottom: 24 }}>
              <Label style={{ marginBottom: 16 } as TextStyle}>Brand Colors</Label>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 } as ViewStyle}>
                <View style={{ width: 60, height: 60, backgroundColor: theme.colors.primary, borderRadius: 8 }} />
                <View style={{ width: 60, height: 60, backgroundColor: theme.colors.secondary, borderRadius: 8 }} />
              </View>
              <Label style={{ marginBottom: 8, fontSize: 11 } as TextStyle}>Gray Palette</Label>
              <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' } as ViewStyle}>
                <View style={{ width: 40, height: 40, backgroundColor: theme.colors.gray900, borderRadius: 6 }} />
                <View style={{ width: 40, height: 40, backgroundColor: theme.colors.gray700, borderRadius: 6 }} />
                <View style={{ width: 40, height: 40, backgroundColor: theme.colors.gray500, borderRadius: 6 }} />
                <View style={{ width: 40, height: 40, backgroundColor: theme.colors.gray300, borderRadius: 6 }} />
                <View style={{ width: 40, height: 40, backgroundColor: theme.colors.gray100, borderRadius: 6 }} />
                <View style={{ width: 40, height: 40, backgroundColor: theme.colors.gray50, borderRadius: 6, borderWidth: 1, borderColor: theme.colors.gray200 }} />
              </View>
            </View>

            <View style={{ marginBottom: 24 }}>
              <Label style={{ marginBottom: 16 } as TextStyle}>Semantic Colors</Label>
              <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' } as ViewStyle}>
                <View style={{ width: 50, height: 50, backgroundColor: theme.colors.success, borderRadius: 8 }} />
                <View style={{ width: 50, height: 50, backgroundColor: theme.colors.warning, borderRadius: 8 }} />
                <View style={{ width: 50, height: 50, backgroundColor: theme.colors.error, borderRadius: 8 }} />
                <View style={{ width: 50, height: 50, backgroundColor: theme.colors.info, borderRadius: 8 }} />
              </View>
            </View>
          </Card>

          <View style={{ marginTop: 48, alignItems: 'center' } as ViewStyle}>
            <Caption>Built with ❤️ using React Native</Caption>
          </View>
        </ScrollView>
  );
}
