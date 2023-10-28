import { Fragment, useContext, useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import { Event, getAllLocalStorageItems, getRefValue, getRefValues, isTrue, preventDefault, refs, set_val, spreadArraysOrObjects, uploadFiles, useEventLoop } from "/utils/state"
import { ColorModeContext, EventLoopContext, initialEvents, StateContext } from "/utils/context.js"
import "focus-visible/dist/focus-visible"
import { Box, Button, HStack, Image, Input, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, option, Select, SimpleGrid, Text, VStack } from "@chakra-ui/react"
import { getEventURL } from "/utils/state.js"
import ReactDropzone from "react-dropzone"
import NextHead from "next/head"



export default function Component() {
  const state = useContext(StateContext)
  const router = useRouter()
  const [ colorMode, toggleColorMode ] = useContext(ColorModeContext)
  const focusRef = useRef();
  
  // Main event loop.
  const [addEvents, connectError] = useContext(EventLoopContext)

  // Set focus to the specified element.
  useEffect(() => {
    if (focusRef.current) {
      focusRef.current.focus();
    }
  })

  // Route after the initial page hydration.
  useEffect(() => {
    const change_complete = () => addEvents(initialEvents())
    router.events.on('routeChangeComplete', change_complete)
    return () => {
      router.events.off('routeChangeComplete', change_complete)
    }
  }, [router])

  const [files, setFiles] = useState([]);

  return (
    <Fragment>
  <Fragment>
  {isTrue(connectError !== null) ? (
  <Fragment>
  <Modal isOpen={connectError !== null}>
  <ModalOverlay>
  <ModalContent>
  <ModalHeader>
  {`Connection Error`}
</ModalHeader>
  <ModalBody>
  <Text>
  {`Cannot connect to server: `}
  {(connectError !== null) ? connectError.message : ''}
  {`. Check if server is reachable at `}
  {getEventURL().href}
</Text>
</ModalBody>
</ModalContent>
</ModalOverlay>
</Modal>
</Fragment>
) : (
  <Fragment/>
)}
</Fragment>
  <Box>
  <VStack sx={{"padding": "5em"}}>
  <VStack>
  <Select onChange={(_e0) => addEvents([Event("state.set_option", {value:_e0.target.value})], (_e0))} placeholder={`Select an example.`} sx={{"colorSchemes": "twitter"}}>
  <option value={`Option 1`}>
  {`Option 1`}
</option>
  <option value={`Option 2`}>
  {`Option 2`}
</option>
  <option value={`Option 3`}>
  {`Option 3`}
</option>
</Select>
</VStack>
  <ReactDropzone accept={{"application/pdf": [".pdf"], "image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"], "image/gif": [".gif"], "image/webp": [".webp"], "text/html": [".html", ".htm"]}} disabled={false} maxFiles={5} multiple={true} onDrop={e => setFiles((files) => e)}>
  {({ getRootProps, getInputProps }) => (
    <Box sx={{"onKeyboard": true, "border": "1px dotted rgb(107,99,246)", "padding": "5em"}} {...getRootProps()}>
    <Input type={`file`} {...getInputProps()}/>
    <VStack>
    <Button sx={{"color": "rgb(107,99,246)", "bg": "white", "border": "1px solid rgb(107,99,246)"}}>
    {`Select File`}
  </Button>
    <Text>
    {`Drag and drop files here or click to select files`}
  </Text>
    <HStack>
    <Button onClick={(_e) => addEvents([Event("state.handle_upload", {files:files}, "uploadFiles")], (_e))}>
    {`Upload`}
  </Button>
    <Button onClick={_e => setFiles((files) => [])}>
    {`Clear`}
  </Button>
  </HStack>
  </VStack>
  </Box>
  )}
</ReactDropzone>
  <HStack>
  {files.map((f) => f.name).map((ttcjgkgf, i) => (
  <Text key={i}>
  {ttcjgkgf}
</Text>
))}
</HStack>
  <SimpleGrid columns={[2]} spacing={`5px`}>
  {state.img.map((whaehraf, i) => (
  <VStack key={i}>
  <Image src={whaehraf}/>
  <Text>
  {whaehraf}
</Text>
</VStack>
))}
</SimpleGrid>
</VStack>
</Box>
  <NextHead>
  <title>
  {`Reflex App`}
</title>
  <meta content={`A Reflex app.`} name={`description`}/>
  <meta content={`favicon.ico`} property={`og:image`}/>
</NextHead>
</Fragment>
  )
}
