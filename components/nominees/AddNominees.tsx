"use client";

import { fetchIPStatus } from "@/backend/lib/fetchApiStatus";
import { GetIPResponse } from "@/types/vote";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { Confetti } from "../Confetti";
import Nomineted from "../Nominated";
import { useDeviceIdentifiers } from "@/app/hooks/useDeviceIdentifiers";

const ENGLISH_ONLY_REGEX = /^[A-Za-z0-9 .,'-]*$/;
const NUMBER_ONLY_REGEX = /^[0-9]*$/;

const englishOnlyFields = ["name", "surname", "municipality", "tole"];
const numberFields = ["age", "ward"];

const parties = [
  "Aam Aadmi Party Nepal",
  "Aam Janata Party",
  "Bahujan Ekata Party Nepal",
  "Bahujan Samaj Party Nepal",
  "Bahujan Shakti Party",
  "Bibeksheel Sajha Party",
  "Churebhawar Democratic Party",
  "CPN (Gauravshali)",
  "CPN UML (Unified Marxist-Leninist)",
  "CPN (Marxist)",
  "CPN (Marxist_Pushpalal)",
  "CPN (Maoist Centre)",
  "CPN (Maoist_Socialist)",
  "CPN (Socialist)",
  "CPN (Unified Socialist)",
  "CPN Ekata National Campaign",
  "Democratic Party Nepal",
  "Democratic Socialist Party Nepal",
  "Deshbhakta Democratic Party Nepal",
  "Deshbhakta Samaj",
  "Federal Democratic National Forum",
  "Federal Development Party Nepal",
  "Federal Khumbuwan Democratic Party Nepal",
  "Federal Nepal Party",
  "Gandhian Party Nepal",
  "Hamro Nepali Party",
  "Historic Janata Party",
  "Inclusive Socialist Party Nepal",
  "Jan-Rastrawadi Party Nepal",
  "Janajagaran Party Nepal",
  "Janaprajatantrik Party Nepal",
  "Janata Janawadi Party Nepal",
  "Janata Progressive Party Nepal",
  "Janata Samajwadi Party Nepal",
  "Janasamajwadi Party Nepal",
  "Janasewa Democratic Party",
  "Jai Janmabhumi Party Nepal",
  "Khumbuwan National Front Nepal",
  "Lok Dal",
  "Maulik Jarokilo Party",
  "Madhes Tarai Forum",
  "Madhesi Janadhikar Forum Madhes",
  "Maoist Communist Party Nepal",
  "Maoist Janamukti Party Nepal",
  "Miteri Party Nepal",
  "Miteri Party Nepal",
  "Mongol National Organization",
  "Modern Nepal Socialist Party",
  "National Citizens Party",
  "National Development Party",
  "National Liberation Movement Nepal",
  "National Liberation Party Nepal",
  "National People-Oriented Democratic Party",
  "National Realist Party Nepal",
  "National Republic Nepal",
  "National Samata Party Nepal",
  "National Socialist Party Nepal",
  "National Unity Forum",
  "National Unity Party (Democratic)",
  "Nationalist Centre Nepal",
  "Nationalist Peoples Party",
  "Nationalist Unity Party",
  "National Sadbhawana Party",
  "Nepal Bibeksheel Party",
  "Nepal Communist Party",
  "Nepal Communist Party (Democratic)",
  "Nepal Communist Party Parivartan",
  "Nepal Democratic Party",
  "Nepal Federal Socialist Party",
  "Nepal Inclusive Party",
  "Nepal Janamukti Party",
  "Nepal Janata Dal",
  "Nepal Janata Party",
  "Nepal Janajagriti Party",
  "Nepal Matribhoomi Party",
  "Nepal Naya Janwadi Party",
  "Nepal Nationalist Party",
  "Nepal Pariwar Dal",
  "Nepal Socialist Congress",
  "Nepal Socialist Party (Lohiyawadi)",
  "Nepal Socialist Party (Naya Shakti)",
  "Nepal Workers and Peasants Party",
  "Nepalbad",
  "Nepali Congress",
  "Nepali Congress (BP)",
  "Nepali Greens Party",
  "Nepali for Nepal Party",
  "Nationalist Youth Front",
  "Parivartan Party",
  "Punarjagaran Party Nepal",
  "Progressive Democratic Party",
  "Progressive Socialist Party",
  "Rastriya Janata Party Nepal",
  "Rastriya Janamorcha",
  "Rastriya Matribhoomi Party",
  "Rastriya Prajatantra Party",
  "Rastriya Prajatantra Party Nepal",
  "Rastriya Sajha Party",
  "Rastriya Swatantra Party",
  "Shiv Sena Nepal",
  "Shram Sanskriti Party",
  "Sachet Nepali Party",
  "Social Democratic Party",
  "Socialist Centre Nepal",
  "Socialist Party Nepal",
  "Terai-Madhes Democratic Party",
  "Trimul Nepal",
  "Ujyaalo Nepal",
  "United Citizens Party",
  "United Nepal Democratic Party",
];

const provinces = [
  "Kosi - (Pradesh 1)",
  "Madhesh - (Pradesh 2)",
  "Bagmati - (Pradesh 3)",
  "Gandaki - (Pradesh 4)",
  "Lumbini - (Pradesh 5)",
  "Karnali - (Pradesh 6)",
  "Sudurpashchim - (Pradesh 7)",
];
const districts = [
  { ne: "अछाम", en: "Achham" },
  { ne: "अर्घखाँची", en: "Arghakhanchi" },
  { ne: "बागलुंग", en: "Baglung" },
  { ne: "बैतडी", en: "Baitadi" },
  { ne: "बाँके", en: "Banke" },
  { ne: "बारा", en: "Bara" },
  { ne: "बाजुरा", en: "Bajura" },
  { ne: "बझाङ", en: "Bajhang" },
  { ne: "बर्दिया", en: "Bardiya" },
  { ne: "भक्तपुर", en: "Bhaktapur" },
  { ne: "भोजपुर", en: "Bhojpur" },
  { ne: "चितवन", en: "Chitwan" },
  { ne: "डडेल्धुरा", en: "Dadeldhura" },
  { ne: "दैलेख", en: "Dailekh" },
  { ne: "दाँग", en: "Dang" },
  { ne: "दार्चुला", en: "Darchula" },
  { ne: "धादिङ", en: "Dhading" },
  { ne: "धनकुटा", en: "Dhankuta" },
  { ne: "धनुषा", en: "Dhanusha" },
  { ne: "दोलखा", en: "Dolakha" },
  { ne: "डोल्पा", en: "Dolpa" },
  { ne: "डोटी", en: "Doti" },
  { ne: "गोरखा", en: "Gorkha" },
  { ne: "गुल्मी", en: "Gulmi" },
  { ne: "हुम्ला", en: "Humla" },
  { ne: "इलाम", en: "Ilam" },
  { ne: "जाजरकोट", en: "Jajarkot" },
  { ne: "झापा", en: "Jhapa" },
  { ne: "जुम्ला", en: "Jumla" },
  { ne: "कैलाली", en: "Kailali" },
  { ne: "कालिकोट", en: "Kalikot" },
  { ne: "कञ्चनपुर", en: "Kanchanpur" },
  { ne: "कपिलवस्तु", en: "Kapilvastu" },
  { ne: "कास्की", en: "Kaski" },
  { ne: "काठमाडौँ", en: "Kathmandu" },
  { ne: "काभ्रेपलाञ्चोक", en: "Kavrepalanchok" },
  { ne: "खोटाङ", en: "Khotang" },
  { ne: "ललितपुर", en: "Lalitpur" },
  { ne: "लमजुङ", en: "Lamjung" },
  { ne: "मकवानपुर", en: "Makwanpur" },
  { ne: "मनाङ", en: "Manang" },
  { ne: "मुगु", en: "Mugu" },
  { ne: "मुस्ताङ", en: "Mustang" },
  { ne: "म्याग्दी", en: "Myagdi" },
  { ne: "मोरङ", en: "Morang" },
  { ne: "नवलपुर", en: "Nawalpur" },
  { ne: "नुवाकोट", en: "Nuwakot" },
  { ne: "परासी", en: "Parasi" },
  { ne: "पर्वत", en: "Parbat" },
  { ne: "पञ्चथर", en: "Panchthar" },
  { ne: "पाल्पा", en: "Palpa" },
  { ne: "प्युठान", en: "Pyuthan" },
  { ne: "रोल्पा", en: "Rolpa" },
  { ne: "रुकुम पूर्व", en: "Rukum East" },
  { ne: "रुकुम पश्चिम", en: "Rukum West" },
  { ne: "रुपन्देही", en: "Rupandehi" },
  { ne: "रामाेछाप", en: "Ramechhap" },
  { ne: "रसुवा", en: "Rasuwa" },
  { ne: "रौतहट", en: "Rautahat" },
  { ne: "सल्यान", en: "Salyan" },
  { ne: "संखुवासभा", en: "Sankhuwasabha" },
  { ne: "सप्तरी", en: "Saptari" },
  { ne: "सिन्धुली", en: "Sindhuli" },
  { ne: "सिन्धुपाल्चोक", en: "Sindhupalchok" },
  { ne: "सिराहा", en: "Siraha" },
  { ne: "सोलुखुम्बु", en: "Solukhumbu" },
  { ne: "सुर्खेत", en: "Surkhet" },
  { ne: "स्याङ्जा", en: "Syangja" },
  { ne: "तनहुँ", en: "Tanahun" },
  { ne: "ताप्लेजुङ", en: "Taplejung" },
  { ne: "तेह्रथुम", en: "Terhathum" },
  { ne: "उदयपुर", en: "Udayapur" },
];

const AddNominees = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    age: "",
    party: "",
    group: "independent",
    province: "",
    district: "",
    municipality: "",
    ward: "",
    tole: "",
    avatar: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const { data, isLoading } = useQuery<GetIPResponse>({
    queryKey: ["ipStatus"],
    queryFn: fetchIPStatus,
  });

  useEffect(() => {
    if (!session) router.push("/login");
  }, [router, session]);

  // LIVE VALIDATION (DEBOUNCED)
  const validateField = (name: string, value: string) => {
    let error = "";

    if (englishOnlyFields.includes(name)) {
      if (value && !ENGLISH_ONLY_REGEX.test(value)) {
        error = "Please use English letters only.";
      }
    }

    if (numberFields.includes(name)) {
      if (value && !NUMBER_ONLY_REGEX.test(value)) {
        error = "Only numbers allowed.";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (name === "avatar" && files) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, avatar: file }));
      setAvatarPreview(URL.createObjectURL(file));
      return;
    }

    // INPUT SET
    setFormData((prev) => ({ ...prev, [name]: value }));

    // DEBOUNCE VALIDATION
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      validateField(name, value);
    }, 500);
  };

  const validateForm = (): boolean => {
    const personalInfo =
      formData.name &&
      formData.surname &&
      formData.age &&
      !errors.name &&
      !errors.surname &&
      !errors.age;

    const affiliation =
      formData.group === "independent" ||
      (formData.group === "party" && formData.party);

    const location =
      formData.province &&
      formData.district &&
      formData.municipality &&
      formData.ward &&
      !errors.municipality &&
      !errors.ward;

    const avatar = formData.avatar !== null;

    return !!(personalInfo && affiliation && location && avatar);
  };

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [formData, errors]);

  const { fingerprint } = useDeviceIdentifiers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error("Fix errors before submitting.");
      return;
    }

    try {
      const fd = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value) fd.append(key, value as string | File);
      });

      fd.append("fingerprint", fingerprint || "");

      const res = await fetch("/api/nominees", {
        method: "POST",
        body: fd,
      });

      const json = await res.json();

      if (json.success) {
        toast.success("Nominee added successfully!");
        setShowConfetti(true);
        setFormData({
          name: "",
          surname: "",
          age: "",
          party: "",
          group: "independent",
          province: "",
          district: "",
          municipality: "",
          ward: "",
          tole: "",
          avatar: null,
        });
        setAvatarPreview(null);
        setErrors({});
      } else {
        toast.error(json.data?.error || "Submission failed");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };

  const getSectionClass = (done: boolean) =>
    `p-4 rounded-lg border-2 transition-all ${
      done ? "bg-green-50 border-green-300" : "bg-gray-50 border-gray-300"
    }`;

  return (
    <div className="max-w-5xl mx-auto p-4 text-slate-900/80">
      {session && data?.youNominatedNominee && (
        <div className="fixed inset-0 z-40 flex items-center justify-center m-6 bg-slate-600  text-slate-900/80 rounded-lg">
          <Nomineted />
        </div>
      )}

      <Confetti trigger={showConfetti} />

      {/* COMPLETION TOP BAR */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">
          Nominate Your Favourite Candidate
        </h2>
        <h1 className="pb-6 text-justify text-xl md:text-4xl font-extrabold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm mt-6">
          Note: By creating a nominee, you are taking part in a meaningful act
          of nation-building. Great citizens choose great leaders — and your
          contribution truly matters for the future of Nepal. Please prepare a
          clear photo and complete details of your favourite nominee before
          submitting. You may review the form below in advance. Every nomination
          will be carefully evaluated by our expert team before being added to
          the official list. It is also advised to create your user account for
          your successful nomination.
        </h1>
        <hr />
        <div className="flex justify-between items-center">
          <span className="font-medium">Form Status:</span>
          <span
            className={`font-bold ${
              isFormValid ? "text-green-700" : "text-orange-500"
            }`}
          >
            {isFormValid ? "Ready to Submit" : "Incomplete"}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className={`h-2 rounded-full transition-all ${
              isFormValid ? "w-full bg-green-500" : "w-1/3 bg-blue-500"
            }`}
          />
        </div>
      </div>

      {/* FORM START */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* PERSONAL INFO */}
        <section
          className={getSectionClass(
            !!formData.name && !!formData.surname && !!formData.age
          )}
        >
          <h3 className="font-semibold text-lg mb-2">Personal Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* NAME */}
            <div>
              <label className="font-medium">Full Name *</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Full name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            {/* SURNAME */}
            <div>
              <label className="font-medium">Surname *</label>
              <input
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Surname"
              />
              {errors.surname && (
                <p className="text-red-500 text-sm">{errors.surname}</p>
              )}
            </div>

            {/* AGE */}
            <div>
              <label className="font-medium">Age *</label>
              <input
                name="age"
                type="text"
                value={formData.age}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Age"
              />
              {errors.age && (
                <p className="text-red-500 text-sm">{errors.age}</p>
              )}
            </div>
          </div>
        </section>

        {/* POLITICAL */}
        <section className={getSectionClass(true)}>
          <h3 className="font-semibold text-lg mb-2">Political Affiliation</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium">Select Group *</label>
              <select
                name="group"
                value={formData.group}
                onChange={handleChange}
                className="p-2 border rounded w-full"
              >
                <option value="party">Party</option>
                <option value="independent">Independent</option>
              </select>
            </div>

            {formData.group === "party" && (
              <div>
                <label className="font-medium">Choose Party *</label>
                <select
                  name="party"
                  value={formData.party}
                  onChange={handleChange}
                  className="p-2 border rounded w-full"
                >
                  <option value="">-- Select a Party --</option>
                  {parties.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </section>

        {/* LOCATION */}
        <section
          className={getSectionClass(
            !!formData.province &&
              !!formData.district &&
              !!formData.municipality &&
              !!formData.ward
          )}
        >
          <h3 className="font-semibold text-lg mb-2">Location Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* PROVINCE */}
            <div>
              <label className="font-medium">Province *</label>
              <select
                name="province"
                value={formData.province}
                onChange={handleChange}
                className="p-2 border rounded w-full"
              >
                <option value="">-- Select --</option>
                {provinces.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* DISTRICT */}
            <div>
              <label className="font-medium">District *</label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="p-2 border rounded w-full"
              >
                <option value="">-- Select --</option>
                {districts.map((d) => (
                  <option key={d.en} value={d.en}>
                    {d.en}
                  </option>
                ))}
              </select>
            </div>

            {/* MUNICIPALITY */}
            <div>
              <label className="font-medium">Municipality *</label>
              <input
                name="municipality"
                value={formData.municipality}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                placeholder="Municipality"
              />
              {errors.municipality && (
                <p className="text-red-500 text-sm">{errors.municipality}</p>
              )}
            </div>

            {/* WARD */}
            <div>
              <label className="font-medium">Ward *</label>
              <input
                name="ward"
                value={formData.ward}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                placeholder="Ward number"
              />
              {errors.ward && (
                <p className="text-red-500 text-sm">{errors.ward}</p>
              )}
            </div>

            {/* TOLE */}
            <div>
              <label className="font-medium">Tole (optional)</label>
              <input
                name="tole"
                value={formData.tole}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                placeholder="Street / Locality"
              />
              {errors.tole && (
                <p className="text-red-500 text-sm">{errors.tole}</p>
              )}
            </div>
          </div>
        </section>

        {/* AVATAR */}
        <section className={getSectionClass(!!formData.avatar)}>
          <h3 className="font-semibold text-lg mb-2">Media Upload</h3>

          <input
            name="avatar"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="p-2 border rounded"
          />

          {avatarPreview && (
            <Image
              src={avatarPreview}
              width={120}
              height={120}
              className="mt-2 rounded shadow"
              alt="Preview"
            />
          )}

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`px-6 py-3 rounded text-white text-lg ${
                isFormValid ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400"
              }`}
            >
              {isFormValid ? "Add Nominee" : "Fill Required Fields"}
            </button>
          </div>
        </section>
      </form>
    </div>
  );
};

export default AddNominees;
