//'use client'

//import { CacheProvider } from '@chakra-ui/next-js'
//import { ChakraProvider } from '@chakra-ui/react'

//export function Providers({ children }: { children: React.ReactNode }) {
 //   return (
   //     <CacheProvider>
     //       <ChakraProvider>
       //         {children}
         //   </ChakraProvider>
        //</CacheProvider>
    //)
//}
/*
"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={defaultSystem}>
      {children}
    </ChakraProvider>
  );
}
*/
"use client";

import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";

const system = createSystem(defaultConfig);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={system}>
      {children}
    </ChakraProvider>
  );
}


