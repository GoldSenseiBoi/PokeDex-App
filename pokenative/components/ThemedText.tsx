import { Text, TextProps } from 'react-native';


type Props = TextProps & {
    variant?: string,
    color?: string
};


export function ThemedText({variant,color, ...rest}: Props) {
  return <Text {...rest} />
}

const styles = StyleSheet.create({
    body3 : {
        fontSize: 10,
        lineHeight: 16,
    },
    headline1 : {
        fontSize: 24,
        lineHeight: 32,
        fontWeight: 'bold',
    },
    caption : {
        fontSize: 8,
        lineHeight: 12,
        },
        