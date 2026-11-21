import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText } from 'lucide-react';
import MessageBody from '../components/chats/MessageBody';

// The same set the chat composer offers, so a symbol dropped in here is the character WhatsApp sends.
const SYMBOLS = [
  '😀',
  '😂',
  '👍',
  '❤️',
  '🔥',
  '👏',
  '🙏',
  '🎉',
  '💡',
  '🤔',
  '😅',
  '😍',
  '😊',
  '😭',
  '😎',
  '🚀',
  '✨',
  '✅',
];

export interface MessagePreviewMedia {
  kind: 'image' | 'video' | 'audio' | 'document';
  src: string | null;
  name: string | null;
}

interface Props {
  text: string;
  media: MessagePreviewMedia | null;
  audience: string | null;
  numbers: readonly string[];
  onInsertSymbol?: (symbol: string) => void;
  symbolsDisabled?: boolean;
}

function PreviewImage({ src }: { src: string }) {
  const { t } = useTranslation();
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  if (failed) {
    return <p className="message-preview-fallback">{t('messageTester.preview.imageUnavailable')}</p>;
  }
  return <img src={src} alt={t('messageTester.preview.imageAlt')} onError={() => setFailed(true)} />;
}

export function MessagePreview({ text, media, audience, numbers, onInsertSymbol, symbolsDisabled }: Props) {
  const { t } = useTranslation();
  const caption = text.trim();
  const hasMedia = !!media && (!!media.src || !!media.name);
  const empty = !caption && !hasMedia;
  const time = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  return (
    <section className="message-preview" aria-labelledby="message-preview-title">
      <div className="message-preview-header">
        <h2 id="message-preview-title" className="eyebrow">
          {t('messageTester.preview.title')}
        </h2>
        <p className="message-preview-hint">{t('messageTester.preview.hint')}</p>
      </div>

      {onInsertSymbol && (
        <div className="message-preview-symbols">
          <span className="group-label" id="message-preview-symbols-label">
            {t('messageTester.preview.symbols')}
          </span>
          <div className="message-preview-symbol-row" role="group" aria-labelledby="message-preview-symbols-label">
            {SYMBOLS.map(symbol => (
              <button
                key={symbol}
                type="button"
                className="message-preview-symbol"
                disabled={symbolsDisabled}
                aria-label={t('messageTester.preview.insertSymbol', { symbol })}
                onClick={() => onInsertSymbol(symbol)}
              >
                {symbol}
              </button>
            ))}
          </div>
        </div>
      )}

      {(audience || numbers.length > 0) && (
        <p className="message-preview-audience">
          {audience}
          {numbers.length > 0 && <span className="message-preview-numbers">{numbers.join(' · ')}</span>}
        </p>
      )}

      <div className="message-preview-stage">
        {empty ? (
          <p className="message-preview-empty">{t('messageTester.preview.empty')}</p>
        ) : (
          <div className="message-preview-bubble">
            {media?.kind === 'image' && media.src && <PreviewImage src={media.src} />}
            {media?.kind === 'video' && media.src && <video src={media.src} controls />}
            {media?.kind === 'audio' && media.src && <audio src={media.src} controls />}
            {media?.kind === 'document' && (
              <div className="message-preview-file">
                <FileText size={18} aria-hidden />
                <span>{media.name || t('messageTester.types.document')}</span>
              </div>
            )}
            {media && media.kind !== 'document' && !media.src && media.name && (
              <div className="message-preview-file">
                <FileText size={18} aria-hidden />
                <span>{media.name}</span>
              </div>
            )}
            {caption && <MessageBody text={text} className="message-preview-text" />}
            <span className="message-preview-time">{time}</span>
          </div>
        )}
      </div>
    </section>
  );
}
