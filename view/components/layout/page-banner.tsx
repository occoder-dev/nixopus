'use client';

import * as React from 'react';
import { forwardRef } from 'react';
import Image from 'next/image';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { TypographyH1 } from '../ui/typography';

const bannerContainer = cva(
    'relative overflow-hidden rounded-2xl',
    {
        variants: {
            padding: {
                sm: 'px-4 py-4',
                md: 'px-6 py-6',
            },
            gradientTone: {
                soft: 'bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20',
                none: '',
            },
        },
        defaultVariants: {
            padding: 'md',
            gradientTone: 'soft',
        },
    }
);

const bannerLayout = cva(
    'relative z-10 flex flex-col items-start justify-between gap-6 md:items-center',
    {
        variants: {
            align: {
                right: 'md:flex-row',
                left: 'md:flex-row-reverse',
            },
        },
        defaultVariants: {
            align: 'right',
        },
    }
);

type BannerVariants = VariantProps<typeof bannerContainer> & VariantProps<typeof bannerLayout>;

export interface BannerProps extends React.HTMLAttributes<HTMLDivElement>, BannerVariants {
    isLoading?: boolean;
    asChild?: boolean;
    badgeText?: string;
    heading?: React.ReactNode;
    subheading?: React.ReactNode;
    description?: React.ReactNode;
    imageSrc?: string;
    imageAlt?: string;
    image?: React.ReactNode;
    gradientClassName?: string;
}

export const Banner = forwardRef<HTMLDivElement, BannerProps>(function Banner(
    {
        isLoading = false,
        asChild,
        align = 'right',
        padding,
        gradientTone = 'soft',
        badgeText,
        heading,
        subheading,
        description,
        image,
        imageSrc = '/plugin.png',
        imageAlt = 'Banner image',
        className,
        gradientClassName,
        children,
        ...props
    },
    ref
) {
    if (isLoading) {
        return <BannerSkeleton align={align} padding={padding} gradientTone={gradientTone} className={className} />;
    }

    const Comp = asChild ? Slot : 'div';

    const ImageSection = (
        <div className="flex-1">
            <div className="relative mx-auto max-w-xs">
                <div className="aspect-square">
                    <div className="flex h-full items-center justify-center">
                        <div className="relative w-full h-full text-center">
                            {image ? (
                                <div className="flex items-center justify-center w-full h-full">
                                    {image}
                                </div>
                            ) : (
                                <Image
                                    src={imageSrc}
                                    alt={imageAlt}
                                    className="object-contain"
                                    fill
                                    sizes="(min-width: 768px) 320px, 50vw"
                                    priority={false}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const DefaultText = (
        <div className="flex-1 space-y-4">
            {badgeText ? (
                <div className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {badgeText}
                </div>
            ) : null}
            {heading ? (
                <TypographyH1 className="text-xl font-bold tracking-tight md:text-2xl lg:text-3xl">
                    {heading}
                </TypographyH1>
            ) : null}
            {subheading ? (
                <p className="text-sm text-muted-foreground md:text-base">
                    {subheading}
                </p>
            ) : null}
            {description ? (
                <p className="text-xs md:text-sm text-muted-foreground/80">
                    {description}
                </p>
            ) : null}
        </div>
    );

    return (
        <Comp
            ref={ref}
            className={cn(
                bannerContainer({ padding, gradientTone }),
                gradientClassName,
                className
            )}
            {...props}
        >
            <div className={bannerLayout({ align })}>
                {children ?? DefaultText}
                {ImageSection}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/5 to-transparent" />
        </Comp>
    );
});

interface BannerSkeletonProps
    extends React.HTMLAttributes<HTMLDivElement>,
    BannerVariants { }

const BannerSkeleton = forwardRef<HTMLDivElement, BannerSkeletonProps>(function BannerSkeleton(
    { align = 'right', padding, gradientTone = 'soft', className, ...props },
    ref
) {
    return (
        <div
            ref={ref}
            className={cn(bannerContainer({ padding, gradientTone }), className)}
            {...props}
        >
            <div className={bannerLayout({ align })}>
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-12 rounded-full" />
                    <Skeleton className="h-6 w-48 md:w-56 lg:w-64" />
                    <Skeleton className="h-4 w-72 md:w-80" />
                    <Skeleton className="h-8 w-32 mt-2" />
                </div>
                <div className="flex-1">
                    <div className="relative mx-auto max-w-xs aspect-square">
                        <Skeleton className="w-full h-full rounded-2xl" />
                    </div>
                </div>
            </div>
        </div>
    );
});