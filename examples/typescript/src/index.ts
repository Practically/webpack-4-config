export interface FunctionProps {
    propOne: string;
    propTwo: string;
}

export const myFunction = (props: FunctionProps): string => {
    return `${props.propOne} - ${props.propTwo}`;
};

myFunction({propOne: 'Hello', propTwo: 'World!'});
