import { useRouter } from "next/router"
import { useTranslation } from "react-i18next"
import { FaDiscord, FaGlobe, FaXTwitter } from "react-icons/fa6"
import { MdInfoOutline } from "react-icons/md"

import { FilterOption, Lang, WalletData } from "@/lib/types"

import { WalletFilters } from "@/components/FindWalletProductTable/data/WalletFilters"
import {
  GreenCheckProductGlyphIcon,
  WarningProductGlyphIcon,
} from "@/components/icons/staking"
import InlineLink from "@/components/Link"
import Tooltip from "@/components/Tooltip"

import { cn } from "@/lib/utils/cn"
import { trackCustomEvent } from "@/lib/utils/matomo"
import { getLocaleFormattedDate } from "@/lib/utils/time"

const SocialLink = (props) => (
  <InlineLink
    display="flex"
    height={6}
    alignItems="center"
    verticalAlign="middle"
    transform="scale(1)"
    transition="transform 0.1s"
    _hover={{
      transform: "scale(1.15)",
    }}
    {...props}
  />
)

interface WalletSubComponentProps {
  wallet: WalletData
  filters: FilterOption[]
  listIdx: number
}

const WalletSubComponent = ({
  wallet,
  filters,
  listIdx,
}: WalletSubComponentProps) => {
  const { locale } = useRouter()
  const { t } = useTranslation("page-wallets-find-wallet")
  const walletFiltersOptions: FilterOption[] = WalletFilters()

  const walletFilterDisplayOrder = [
    t("page-find-wallet-features"),
    t("page-find-wallet-security"),
    `${t("page-find-wallet-buy-crypto")} / ${t("page-find-wallet-sell-for-fiat")}`,
    t("page-find-wallet-smart-contract"),
    t("page-find-wallet-advanced"),
  ]

  const walletLastUpdated = getLocaleFormattedDate(
    locale as Lang,
    wallet.last_updated
  )

  trackCustomEvent({
    eventCategory: "WalletMoreInfo",
    eventAction: "More info wallet",
    eventName: `More info ${wallet.name}`,
  })

  return (
    <div className="flex flex-row gap-2">
      <div className="w-1 md:w-14">
        <div
          className={cn(
            "m-auto h-full w-1 bg-gradient-to-b to-97%",
            wallet.brand_color
          )}
        />
      </div>
      <div className="flex w-full flex-1 flex-col gap-4">
        <div className="flex w-full flex-col justify-between xl:flex-row">
          {walletFilterDisplayOrder.map((filterHeader, idx) => {
            const filterItem = walletFiltersOptions.find(
              (option) => option.title === filterHeader
            )!
            return (
              <div key={idx} className="mx-2">
                <h4 className="mb-2 text-md font-bold">{filterItem.title}</h4>
                <ul className="m-0 list-none">
                  {filterItem.items
                    .sort((a, b) =>
                      wallet[b.filterKey] === wallet[a.filterKey]
                        ? 0
                        : wallet[b.filterKey]
                          ? 1
                          : -1
                    )
                    .map((item, idx) => {
                      const featureColor = wallet[item.filterKey]
                        ? "text-body"
                        : "text-disabled"
                      return (
                        <li key={idx} className="mb-2 flex flex-row gap-2">
                          <span>
                            {wallet[item.filterKey] ? (
                              <GreenCheckProductGlyphIcon
                                className="text-primary"
                                boxSize={4}
                              />
                            ) : (
                              <WarningProductGlyphIcon
                                className="text-secondary"
                                boxSize={4}
                              />
                            )}
                          </span>
                          <p className={`leading-1 ${featureColor}`}>
                            {item.filterLabel}{" "}
                            <Tooltip
                              content={
                                <p className="text-body">{item.description}</p>
                              }
                            >
                              <span className="whitespace-nowrap">
                                <MdInfoOutline color={featureColor} />
                              </span>
                            </Tooltip>
                          </p>
                        </li>
                      )
                    })}
                </ul>
              </div>
            )
          })}
        </div>
        <div>
          <h4 className="mb-2 text-md font-bold">
            {t("page-find-wallet-social-links")}
          </h4>
          <div className="flex flex-row gap-4">
            <SocialLink
              href={wallet.url}
              hideArrow
              customEventOptions={{
                eventCategory: "WalletExternalLinkList",
                eventAction: "Go to wallet",
                eventName: `Website: ${wallet.name} ${listIdx}`,
                eventValue: JSON.stringify(filters),
              }}
            >
              <FaGlobe size="2xl" />
            </SocialLink>
            {wallet.discord && (
              <SocialLink
                href={wallet.discord}
                hideArrow
                customEventOptions={{
                  eventCategory: "WalletExternalLinkList",
                  eventAction: "Go to wallet",
                  eventName: `Discord: ${wallet.name} ${listIdx}`,
                  eventValue: JSON.stringify(filters),
                }}
              >
                <FaDiscord color="#7289da" size="2xl" />
              </SocialLink>
            )}
            {wallet.twitter && (
              <SocialLink
                href={wallet.twitter}
                hideArrow
                customEventOptions={{
                  eventCategory: "WalletExternalLinkList",
                  eventAction: "Go to wallet",
                  eventName: `Twitter: ${wallet.name} ${listIdx}`,
                  eventValue: JSON.stringify(filters),
                }}
              >
                <FaXTwitter color="#1da1f2" size="2xl" />
              </SocialLink>
            )}
          </div>
        </div>
        <p className="italic">{`${wallet.name} ${t("page-find-wallet-info-updated-on")} ${walletLastUpdated}`}</p>
      </div>
    </div>
  )
}

export default WalletSubComponent
