import React from "react"
import {
  AgilityPic,
  ImageField,
  URLField,
  UnloadedModuleProps,
} from "@agility/nextjs"
import Link from "next/link"
import { getContentItem } from "lib/cms/getContentItem"

interface IHeroBanner {
  bannerHeading: string
  bannerImage: ImageField
  primaryButton?: URLField
  tagline?: string
  highPriority?: string
}

const isUrlAbsolute = (url: string) =>
  url.indexOf("://") > 0 || url.indexOf("//") === 0

const renderCTA = (btn: URLField) => {
  const { href, target, text } = btn
  if (!href || !text) return null
  const classes =
    "inline-block mt-6 md:mt-8 px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-primary-500 hover:bg-primary-700 dark:bg-primary-400 dark:hover:bg-primary-600 focus:outline-hidden focus:border-primary-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
  return isUrlAbsolute(href) ? (
    <a data-agility-field="primaryButton" href={href} target={target} className={classes}>
      {text}
    </a>
  ) : (
    <Link data-agility-field="primaryButton" href={href} target={target || undefined} className={classes}>
      {text}
    </Link>
  )
}

/**
 * Hero Banner (image will go across and stretch the page, text overlays image)
 */
const HeroBanner = async ({ module, languageCode }: UnloadedModuleProps) => {
  const { fields, contentID } = await getContentItem<IHeroBanner>({
    contentID: module.contentid,
    languageCode,
  })

  const priority = fields.highPriority === "true"

  return (
    <section
      data-agility-component={contentID}
      className="relative isolate left-1/2 right-1/2 ml-[-50vw] mr-[-50vw] w-screen h-[80vh] md:h-[90vh]"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <AgilityPic
          image={fields.bannerImage}
          className="h-full w-full object-cover object-center"
          priority={priority}
          fallbackWidth={1600}
          sources={[
            { media: "(min-width: 1536px)", width: 1920 },
            { media: "(min-width: 1024px)", width: 1600 },
            { media: "(min-width: 640px)", width: 1200 },
            { media: "(max-width: 639px)", width: 800 },
          ]}
        />
      </div>
  
      {/* Overlay */}
      <div className="absolute inset-0 z-10 bg-black/40 md:bg-black/50" />
  
      {/* Centered overlay content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6">
        {fields.tagline && (
          <div
            data-agility-field="tagline"
            className="font-bold text-primary-300 text-sm uppercase tracking-wide drop-shadow"
          >
            {fields.tagline}
          </div>
        )}
        <h1
          data-agility-field="bannerHeading"
          className="mt-2 font-display text-4xl md:text-6xl font-black tracking-wide text-white drop-shadow-lg"
        >
          {fields.bannerHeading}
        </h1>
  
        {fields.primaryButton && renderCTA(fields.primaryButton)}
      </div>
    </section>
  )
  
}

export default HeroBanner
