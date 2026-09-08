import type { HorizonConfig } from '../types'

export function ServerMeta({ config, playerCount }: { config: HorizonConfig; playerCount?: number }) {
  return <footer className="server-meta">
    <div className="social-links">{config.Socials.map(link => <a key={link.label} href={link.url} target="_blank" rel="noreferrer">{link.label}</a>)}</div>
    <div className="build-meta">
      <span>BUILD {config.Server.build}</span>
      {config.Brand.showSyncLab && <span>SYNC LAB</span>}
      {config.Server.showPlayerCount && playerCount !== undefined && <span>{playerCount} ONLINE</span>}
    </div>
  </footer>
}
