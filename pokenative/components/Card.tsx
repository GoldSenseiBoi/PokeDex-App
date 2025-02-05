import type { viewProps } from 'react-native';
import { View } from 'react-native';

type Props = viewProps 

export function Card ({style, ...rest}: Props) {
    return <View style={[style, styles]} {...rest} />;

}

const styles = {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
};