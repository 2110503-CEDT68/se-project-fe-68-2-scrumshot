"use client";

import CampgroundForm from "@/app/components/CampgroundForm";
import {
	getCampground,
	updateCampground,
	validateCampground,
} from "@/libs/campgrounds";
import { CampgroundModifiable } from "@/libs/types";
import { Backdrop, CircularProgress } from "@mui/material";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const defaultCampground: CampgroundModifiable = {
	name: "",
	description: "",
	address: "",
	district: "",
	province: "",
	postalcode: "",
	tel: "",
	region: "Central",
	pricePerNight: 0,
	picture: "",
};

export default function EditCampgroundPage() {
	const { data: session } = useSession();
	const router = useRouter();
	const params = useParams<{ id: string }>();
	const id = params?.id;

	const [campground, setCampground] = useState<CampgroundModifiable>(defaultCampground);
	const [validationError, setValidationError] = useState<
		[keyof CampgroundModifiable, string] | [null, null]
	>([null, null]);
	const [isLoadingCampground, setIsLoadingCampground] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		const loadCampground = async () => {
			if (!id) {
				setIsLoadingCampground(false);
				return;
			}

			setIsLoadingCampground(true);
			const response = await getCampground(id);
			if (!response.success) {
				alert(response.message);
				router.push("/campgrounds");
				return;
			}

			const data = response.data;
			setCampground({
				name: data.name,
				description: data.description,
				address: data.address,
				district: data.district,
				province: data.province,
				postalcode: data.postalcode,
				tel: data.tel,
				region: data.region,
				pricePerNight: data.pricePerNight,
				picture: data.picture,
			});
			setIsLoadingCampground(false);
		};

		loadCampground();
	}, [id, router]);

	const handleSubmit = async () => {
		const validationResult = validateCampground(campground);
		setValidationError(validationResult);

		if (validationResult[0] !== null) return;
		if (!id) return;

		const confirmed = window.confirm(
			"Are you sure you want to save campground changes?"
		);
		if (!confirmed) return;

		setIsSubmitting(true);
		const result = await updateCampground(
			id,
			campground,
			session?.user?.backendToken ?? "",
		);

		if (!result.success) {
			alert(result.message);
			setIsSubmitting(false);
			return;
		}

		router.push(`/campgrounds/${id}`);
	};

	if (isLoadingCampground) {
		return (
			<main className="w-full p-10 flex flex-col items-center">
				<CircularProgress />
				<p className="mt-4 text-gray-600">Loading campground...</p>
			</main>
		);
	}

	return (
		<main className="w-full p-10 flex flex-col items-center">
			<Backdrop
				sx={{ color: "#fff", zIndex: 1000, flexDirection: "column", gap: 2 }}
				open={isSubmitting}
			>
				<CircularProgress color="inherit" />
				<p>Updating campground...</p>
			</Backdrop>

			<h1 className="text-4xl font-bold mb-8">Edit Campground</h1>

			<CampgroundForm
				campground={campground}
				setCampground={setCampground}
				errorInputName={validationError[0]}
				errorMessage={validationError[1]}
				onSubmit={handleSubmit}
			/>
		</main>
	);
}
