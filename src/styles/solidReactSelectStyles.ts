import { StylesConfig } from "react-select"

interface getReactSelectStylesProps{
    primaryColor?: string;
}

export const getReactSelectStyles = ({primaryColor = "#f24e1e"} : getReactSelectStylesProps): StylesConfig => {
    return {
        container: (styles: any) => ({
          ...styles,
          //width: '200px',
          marginBottom: null,
          maxWidth: null,
          zIndex: '999'
        }),
        input: (styles: any) => ({
          ...styles,
          fontSize: '13px',
          paddingLeft: '15px'
        }),
        option: (provided: any, state: any) => ({
          ...provided,
          backgroundColor: state.isSelected ? primaryColor : 'white',
          cursor: state.isDisabled ? 'not-allowed' : 'pointer',
          fontSize: '13px',
          paddingLeft: '15px',
          ':hover': {
            backgroundColor: !state.isSelected ? '#ffefe1' : primaryColor,
            color: !state.isSelected ? primaryColor : '#ffffff'
          }
        }),
        control: (styles: any, state: any) => ({
          ...styles,
          backgroundColor: '#EFF0F6',
          //border: "2px",
          borderColor: state.isFocused ? primaryColor : 'transparent',
          // ':focus': {
          boxShadow: 0, //state.isFocused ? "0 0 0 1px #f24e1e" : ""
          // },
          ':hover': {
            //border: '2px solid',
            borderColor: state.isFocused ? primaryColor : '#d9dbe9',
            backgroundColor: state.isFocused ? '#D9DBE9' : '#D9DBE9'
          },
          height: '45px',
          borderRadius: '90px'
        }),
        placeholder: (styles: any, state: any) => ({
          ...styles,
          paddingLeft: '15px',
          fontSize: '14px'
        }),
        singleValue: (provided: any, state: any) => {
          const opacity = state.isDisabled ? 0.5 : 1
          const transition = 'opacity 300ms'
          const color = '#14142b'
          const paddingLeft = '15px'
    
          return {
            ...provided,
            paddingLeft,
            opacity,
            transition,
            color,
            fontSize: '14px'
          }
        }
    }
}