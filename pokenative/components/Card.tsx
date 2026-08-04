import type { ViewProps } from 'react-native';
import { View } from 'react-native';
import { Shadow } from '../constants/Shadow';

type Props = ViewProps

export function Card ({style, ...rest}: Props) {
    return <View style={[styles, style]} {...rest} />;

}

const styles = {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    ...Shadow,
};