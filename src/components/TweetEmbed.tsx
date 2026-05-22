"use client";

import "react-tweet/theme.css";
import { useState, useRef, useEffect } from "react";
import {
  useTweet,
  enrichTweet,
  TweetContainer,
  TweetHeader,
  TweetInReplyTo,
  TweetBody,
  TweetMedia,
  QuotedTweet,
  TweetSkeleton,
} from "react-tweet";

function TweetMiss({ url }: { url: string }) {
  return (
    <a className="entry__link-card" href={url} target="_blank" rel="noopener noreferrer">
      <span className="entry__link-card__copy">
        <span className="entry__link-card__title">View this post on X</span>
        <span className="entry__link-card__site">x.com ↗</span>
      </span>
    </a>
  );
}

/** Compact tweet card: react-tweet parts (header/body/media) with the
 *  likes/actions/replies rows removed, clamped to a fixed height with a
 *  "show more" toggle so it sits like a photo/video in the timeline. */
export function TweetEmbed({ id, url }: { id: string; url: string }) {
  const { data, error, isLoading } = useTweet(id);
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    setOverflows(!expanded && el.scrollHeight > el.clientHeight + 4);
  }, [data, expanded]);

  if (isLoading) return <div className="entry__tweet"><TweetSkeleton /></div>;
  if (error || !data) return <div className="entry__tweet"><TweetMiss url={url} /></div>;

  // Some syndication responses omit empty entity arrays; enrichTweet assumes
  // they exist, so backfill them (and fall back to a link card on any error).
  let tweet;
  try {
    const e = data.entities;
    tweet = enrichTweet({
      ...data,
      entities: {
        hashtags: e?.hashtags ?? [],
        user_mentions: e?.user_mentions ?? [],
        urls: e?.urls ?? [],
        symbols: e?.symbols ?? [],
        media: e?.media,
      },
    } as typeof data);
  } catch {
    return <div className="entry__tweet"><TweetMiss url={url} /></div>;
  }
  return (
    <div className="entry__tweet">
      <TweetContainer>
        <TweetHeader tweet={tweet} />
        <div ref={bodyRef} className="tw-clamp" data-expanded={expanded}>
          {tweet.in_reply_to_status_id_str && <TweetInReplyTo tweet={tweet} />}
          <TweetBody tweet={tweet} />
          {tweet.mediaDetails?.length ? <TweetMedia tweet={tweet} /> : null}
          {tweet.quoted_tweet && <QuotedTweet tweet={tweet.quoted_tweet} />}
        </div>
        <div className="tw-foot">
          {overflows && (
            <button type="button" className="tw-more" onClick={() => setExpanded(true)}>show more ↓</button>
          )}
          <a className="tw-source" href={url} target="_blank" rel="noopener noreferrer">view on X ↗</a>
        </div>
      </TweetContainer>
    </div>
  );
}
