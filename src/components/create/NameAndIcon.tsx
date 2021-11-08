import { FormControl, FormErrorMessage, HStack, Input } from "@chakra-ui/react"
import { useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import IconSelector from "../create-guild/IconSelector"

const forbiddenNames = ["404", "guild", "group", "groups"]
const easterEggNames = ["hoodie", "Hoodie"]
const easterEggSquidNames = ["squid hoodie", "Squid Hoodie"]

const NameAndIcon = (props) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const urlName = useWatch({ name: "urlName" })

  let [name, setName] = useState(urlName)
  let [easterFound, setEasterFound] = useState(0)
  let [updated, setUpdated] = useState(false)

  if (props.updateWarn && !updated)
  {
    setEasterFound(easterFound + 1)
    setUpdated(true)
  }

  return (
    <FormControl isRequired isInvalid={errors?.name}>
      <HStack spacing={2}>
        <IconSelector showEasterIcon={easterEggSquidNames.includes(name) || easterFound}/>
        <Input
          size="lg"
          maxWidth="sm"
          {...register("name", {
            required: "This field is required.",
            maxLength: {
              value: 50,
              message: "The maximum possible name length is 50 characters",
            },
            validate: () =>
            forbiddenNames.includes(name) || (easterEggSquidNames.includes(name) && (easterFound > 2)) ? "Please pick a different name." :
            (easterEggSquidNames.includes(name) && easterFound == 2) ? "Now change to a better name this one is weird" :
            easterEggSquidNames.includes(name) ? "We made a special icon for you!" : true,
          })}
          onChange={(e) =>{
              setName(e.target.value)
              if (easterEggSquidNames.includes(e.target.value) && (easterFound < 3)) {
                setEasterFound(easterFound + 1)
              }
            }
          }
        />
        <img src="/easterEggs/hoodieHead.png" width="64" height="64" style={easterEggNames.includes(name) ?
            {transition:'opacity 1500ms ease-out', opacity:'1'}:
            {transition:'opacity 1500ms ease-in', opacity:'0'}}/>
      </HStack>
      <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
    </FormControl>
  )
}

export default NameAndIcon
